import logging
import threading

# Konfiguracja loggera
logger = logging.getLogger(__name__)

class MessageStore:
    def __init__(self):
        self.sent_messages = []  # Lista przechowująca wysłane wiadomości
        self.received_messages = []  # Lista przechowująca otrzymane wiadomości
        self.lock = threading.Lock()  # Blokada do synchronizacji

    def add_message_to_sent(self, message):
        with self.lock:  # Użycie blokady
            self.sent_messages.append(message)
            logger.info(f"Sent message: {message}")

    def add_received_message(self, message):
        with self.lock:  # Użycie blokady
            self.received_messages.append(message)
            logger.info(f"Received message: {message}")

    def get_message_to_sent(self):
        with self.lock:
            self

    def get_sent_message(self):
        with self.lock:
            if self.sent_messages:
                oldest_message = self.sent_messages.pop(0)  # Pobiera i usuwa najstarszą wiadomość
                logger.info(f"Retrieved oldest sent message: {oldest_message}")
                return oldest_message
            else:
                logger.info("No sent messages available")
                return None

    def get_received_message(self):
        with self.lock:
            if self.received_messages:
                oldest_message = self.received_messages.pop(0)  # Pobiera i usuwa najstarszą wiadomość
                logger.info(f"Retrieved oldest received message: {oldest_message}")
                return oldest_message
            else:
                logger.info("No received messages available")
                return None

# Stworzenie globalnego obiektu MessageStore
message_store = MessageStore()

