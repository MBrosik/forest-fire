import pika
import logging
import json
from simulation.rabbitmq.message_store import MessageStore
import time

logger = logging.getLogger(__name__)
    
def produce_message(exchange, channel, routing_key, message):
    try:
        if channel is None:
            logger.info("Channel is None")
            return
        #logger.info(f"Channel: {channel}")
        channel.basic_publish(exchange=exchange, routing_key=routing_key, body=json.dumps(message))
        if routing_key in ["Forester patrol state topic", "Fire brigades state topic"]:
            logger.info(f"Sent message: {message}")
    except Exception as e:
        logger.error(f"Error sending message: {e}")

def start_producing_messages(exchange, routing_key, store: MessageStore, username, password):
    CONNECTION_CREDENTIALS = pika.PlainCredentials(username, password)
    
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost', credentials=CONNECTION_CREDENTIALS))
    channel = connection.channel()
    
    while(1):
        message = store.get_message_to_sent(routing_key)
        if(message):
            #logger.info("Message to sent found.")
            produce_message(exchange, channel, routing_key, message)
        else:
            #logger.info("No messages to sent")
            pass
        time.sleep(0.5)
