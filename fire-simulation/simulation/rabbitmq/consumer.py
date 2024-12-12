import pika
import logging
import json
from simulation.rabbitmq.message_store import MessageStore
import functools


logger = logging.getLogger(__name__)

def callback(ch, method, properties, body, store: MessageStore):
    data = json.loads(body.decode('utf-8'))
    store.add_received_message(data)
    logger.info("Received message:", data)
    ch.basic_ack(delivery_tag=method.delivery_tag)

def consume_messages_from_queue(channel, queue_name, store: MessageStore):
    try:
        callback_with_store = functools.partial(callback, store=store)

        channel.basic_consume(queue=queue_name, on_message_callback=callback_with_store)

        logger.info(f"Waiting for messages in queue: {queue_name}.")
        
        channel.start_consuming()

    except Exception as e:
        logger.error(f"Error consuming messages: {e}")

