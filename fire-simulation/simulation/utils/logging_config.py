import logging
import os

def setup_logging():
    # Tworzenie katalogu na logi, jeśli nie istnieje
    log_dir = 'logs'
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)

    # Tworzenie loggera
    logger = logging.getLogger()
    logger.setLevel(logging.DEBUG)  # Ustawiamy poziom logowania na DEBUG, można to zmienić

    # Tworzenie formatera logów
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

    # Tworzenie handlera do konsoli
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)  # Poziom logowania na konsolę (można zmienić)
    console_handler.setFormatter(formatter)

    # Tworzenie handlera do zapisu do pliku
    file_handler = logging.FileHandler(os.path.join(log_dir, 'logfile.log'))
    file_handler.setLevel(logging.DEBUG)  # Poziom logowania do pliku (można zmienić)
    file_handler.setFormatter(formatter)

    # Dodanie handlerów do loggera
    logger.addHandler(console_handler)
    logger.addHandler(file_handler)

# Wywołanie konfiguracji loggera
setup_logging()
