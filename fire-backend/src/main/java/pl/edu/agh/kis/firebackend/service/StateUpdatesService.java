package pl.edu.agh.kis.firebackend.service;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rabbitmq.client.Delivery;

import lombok.AllArgsConstructor;
import pl.edu.agh.kis.firebackend.model.UpdatesQueue;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.rabbitmq.OutboundMessage;
import reactor.rabbitmq.QueueSpecification;
import reactor.rabbitmq.Receiver;
import reactor.rabbitmq.SendOptions;
import reactor.rabbitmq.Sender;

@Service
@AllArgsConstructor
public class StateUpdatesService {
    private Sender sender;
    private Receiver receiver;
    private ObjectMapper mapper;

    private static final Logger log = LoggerFactory.getLogger(StateUpdatesService.class);

    public <T> Flux<T> createUpdatesFlux(UpdatesQueue<T> queue) {
        return sender.declareQueue(QueueSpecification.queue(queue.name()))
                .doOnError(e -> log.error("Failed to declare queue: {}", e.toString()))
                .thenMany(receiver.consumeAutoAck(queue.name())
                        .mapNotNull(message -> {
                            try {
                                return parseMessage(message, queue.eventClass());
                            } catch (IOException e) {
                                log.error("Failed to parse RMQ message: {}", e.toString());
                                return null;
                            }
                        }))
                .onErrorResume(e -> {
                    log.error("Error during message consumption: {}", e.toString());
                    return Flux.empty();
                });
    }


    private <T> T parseMessage(Delivery delivery, Class<T> Tclass) throws IOException {
        return mapper.readValue(delivery.getBody(), Tclass);        
    }

    public <T> Mono<Void> sendMessageToQueue(String queueName, T message) {
        System.out.println("sendMessageToQueue");
        System.out.println(queueName);

        try {
            byte[] messageBytes = mapper.writeValueAsBytes(message);
            return sender.send(Mono.just(new OutboundMessage("", queueName, messageBytes)))
                    .doOnSubscribe(subscription -> log.info("Subscribed to sendMessageToQueue"))
                    .doOnNext(message1 -> log.info("Message sent to broker: {}", message1))
                    .doOnError(e -> log.error("Error in sender.send: {}", e))
                    .doFinally(signalType -> log.info("Sender.send finalized with signal: {}", signalType));
        } catch (IOException e) {
            log.error("Failed to serialize message: {}", e.toString());
            return Mono.error(e);
        }
    }


}
