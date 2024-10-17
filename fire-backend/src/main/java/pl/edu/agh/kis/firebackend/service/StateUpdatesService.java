package pl.edu.agh.kis.firebackend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rabbitmq.client.Delivery;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import pl.edu.agh.kis.firebackend.model.UpdatesQueue;
import reactor.core.publisher.Flux;
import reactor.rabbitmq.QueueSpecification;
import reactor.rabbitmq.Receiver;
import reactor.rabbitmq.Sender;

import java.io.IOException;

@Service
@AllArgsConstructor
public class StateUpdatesService {
    private Sender sender;
    private Receiver receiver;
    private ObjectMapper mapper;

    private static final Logger log = LoggerFactory.getLogger(StateUpdatesService.class);

    public <T> Flux<T> createUpdatesFlux(UpdatesQueue<T> queue) {
        // TODO: there is probably better way to do it than .block()
        sender.declare(new QueueSpecification().name(queue.name())).block();

        return receiver.consumeAutoAck(queue.name())
                .mapNotNull(message -> {
                    try {
                        return parseMessage(message, queue.eventClass());
                    } catch (IOException e) {
                        log.error("Failed to parse RMQ message: {}", e.toString());
                        return null;
                    }
                });
    }

    private <T> T parseMessage(Delivery delivery, Class<T> Tclass) throws IOException {
        return mapper.readValue(delivery.getBody(), Tclass);
    }

}
