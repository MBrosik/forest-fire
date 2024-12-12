import pika
import logging
from simulation.rabbitmq.message_store import MessageStore

logger = logging.getLogger(__name__)
    
def produce_message(exchange, channel, routing_key, message):
    try:
        if channel is None:
            logger.info("Channel is None")
            return
        logger.info(f"Channel: {channel}")
        channel.basic_publish(exchange=exchange, routing_key=routing_key, body=message)
        logger.info(f"Sent message: {message}")
    except Exception as e:
        logger.error(f"Error sending message: {e}")

def start_producing_messages(exchange, channel, routing_key, store: MessageStore):
    while(1):
        message = store.get_message_to_sent()
        if(message):
            logger.info("Message to sent found.")
            produce_message(exchange, channel, routing_key, message)
        else:
            #logger.info("No messages to sent")
            pass
