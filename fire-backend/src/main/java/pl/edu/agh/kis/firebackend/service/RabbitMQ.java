package pl.edu.agh.kis.firebackend.service;

import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RabbitMQ {
    private RabbitTemplate template;

    @Autowired
    public RabbitMQ(RabbitTemplate template) {
        this.template = template;
    }

    public void send(byte[] body) {
        this.template.send(new Message(body));
    }
}
