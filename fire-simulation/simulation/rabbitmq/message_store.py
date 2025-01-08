import logging
import threading
from collections import defaultdict, deque


# Konfiguracja loggera
logger = logging.getLogger(__name__)

class MessageStore:
    def __init__(self):
        self.messages_to_sent = defaultdict(deque)  # Każda nazwa kolejki ma swoją deque
        self.received_messages = defaultdict(deque) 
        self.lock = threading.Lock()  # Blokada do synchronizacji

    def add_received_message(self, message, queue_name):
        with self.lock:  # Użycie blokady
            self.received_messages[queue_name].append(message)
            logger.info(f"Received message: {message}")


    def add_message_to_sent(self, queue_name, message):
        """Dodaje wiadomość do określonej kolejki."""
        with self.lock:
            self.messages_to_sent[queue_name].append(message)
            #logger.info(f"Added message to queue '{queue_name}': {message}")

    def get_message_to_sent(self, queue_name):
        """Pobiera i usuwa najstarszą wiadomość z danej kolejki."""
        with self.lock:
            if self.messages_to_sent[queue_name]:
                oldest_message = self.messages_to_sent[queue_name].popleft()
                #logger.info(f"Retrieved oldest sent message from queue '{queue_name}': {oldest_message}")
                return oldest_message
            else:
                #logger.info(f"No messages available in queue '{queue_name}'")
                return None


    def get_sent_message(self):
        pass

    def get_received_message(self, queue_name):
        with self.lock:
            if self.received_messages[queue_name]:
                oldest_message = self.received_messages[queue_name].popleft()  # Pobiera i usuwa najstarszą wiadomość
                logger.info(f"Retrieved oldest received message: {oldest_message} from  queue: {queue_name}")
                return oldest_message
            else:
                #logger.info("No received messages available")
                return None

# Stworzenie globalnego obiektu MessageStore
message_store = MessageStore()

