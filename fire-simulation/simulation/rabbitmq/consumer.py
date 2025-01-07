import pika
import logging
import json
from simulation.rabbitmq.message_store import MessageStore
import functools


logger = logging.getLogger(__name__)

def callback(ch, method, properties, body, store: MessageStore, queue_name):
    data = json.loads(body.decode('utf-8'))
    store.add_received_message(data, queue_name)
    logger.info(f"Received message {data} from {queue_name}")
    ch.basic_ack(delivery_tag=method.delivery_tag)

def consume_messages_from_queue(queue_name, store: MessageStore, username, password):

    CONNECTION_CREDENTIALS = pika.PlainCredentials(username, password)
        
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost', credentials=CONNECTION_CREDENTIALS))
    channel = connection.channel()

    try:
        callback_with_store = functools.partial(callback, store=store, queue_name=queue_name)

        channel.basic_consume(queue=queue_name, on_message_callback=callback_with_store)

        logger.info(f"Waiting for messages in queue: {queue_name}.")
        
        channel.start_consuming()

    except Exception as e:
        logger.error(f"Error consuming messages: {e}")

