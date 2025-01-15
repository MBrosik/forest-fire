import logging

class ColoredFormatter(logging.Formatter):
    COLORS = {
        'DEBUG': '\033[94m',    # Niebieski
        'INFO': '\033[92m',     # Zielony
        'WARNING': '\033[93m',  # Żółty
        'ERROR': '\033[91m',    # Czerwony
        'CRITICAL': '\033[95m', # Fioletowy
        'RESET': '\033[0m'      # Resetowanie koloru
    }

    def format(self, record):
        log_color = self.COLORS.get(record.levelname, self.COLORS['RESET'])
        message = super().format(record)
        return f"{log_color}{message}{self.COLORS['RESET']}"

def setup_logging():

    # Tworzenie loggera
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    # Tworzenie formatera logów
    formatter = ColoredFormatter('%(name)s - %(levelname)s - %(message)s')

    # Tworzenie handlera do konsoli
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)

    # Dodanie handlerów do loggera
    logger.addHandler(console_handler)
