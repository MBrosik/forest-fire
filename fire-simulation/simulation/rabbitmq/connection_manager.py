import pika
import logging

logger = logging.getLogger(__name__)

# Konfiguracja RabbitMQ
RABBITMQ_HOST = 'localhost:15672'
QUEUE_NAMES = [
    "Forester patrol action queue",
    "Forester patrol state queue",
    "Camera queue",
    "Temp and air humidity queue",
    "Wind speed queue",
    "Wind direction queue",
    "Litter moisture queue",
    "CO2 queue",
    "PM2.5 queue",
    "Fire brigades action queue",
    "Fire brigades state queue"
]

TOPIC_NAMES = [
    "Forester patrol action topic",
    "Forester patrol state topic",
    "Camera topic",
    "Temp and air humidity topic",
    "Wind speed topic",
    "Wind direction topic",
    "Litter moisture topic",
    "CO2 topic",
    "PM2.5 topic",
    "Fire brigades action topic",
    "Fire brigades state topic"
]

def create_queues(exchange_name, username, password):
    try:
        CONNECTION_CREDENTIALS = pika.PlainCredentials(username, password)
        
        connection = pika.BlockingConnection(pika.ConnectionParameters('localhost', credentials=CONNECTION_CREDENTIALS))
        channel = connection.channel()

        # Tworzenie kolejek
        for queue_name in QUEUE_NAMES:
            channel.queue_declare(queue=queue_name)
            logger.info(f"Queue created: {queue_name}")

        # Tworzenie wymiany typu "topic"
        channel.exchange_declare(exchange=exchange_name, exchange_type='topic')

        # Wiązanie kolejek z tematami
        for topic_name, queue_name in zip(TOPIC_NAMES, QUEUE_NAMES):
            channel.queue_bind(exchange=exchange_name, queue=queue_name, routing_key=topic_name)
            logger.info(f"Queue '{queue_name}' bound to topic '{topic_name}'")

        # Zamknięcie połączenia
        logger.info("All queues and topics are created and bound.")
        return connection, channel
        
    except Exception as e:
        logger.error(f"Error connecting to RabbitMQ: {e}")
        return None, None
        
    # if connection is not None:
    #     connection.close()
    #     print("Connection closed")
    # else:
    #     print("Connection is None")