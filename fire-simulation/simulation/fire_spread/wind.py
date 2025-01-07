import random
import logging

from simulation.sectors.geographic_direction import GeographicDirection

logger = logging.getLogger(__name__)

class Wind:

    def __init__(self):
        self._speed = random.uniform(0, 32)
        self._direction = random.choice(list(GeographicDirection))
        logger.info(f"Initial wind: {self._speed} {self._direction}")
    
    def update_wind(self):
        change_in_speed = random.uniform(-2.5, 2.5)
    
        self._speed = max(0, self._speed + change_in_speed)
        
        current_direction_value = self._direction.value
        direction_change = random.choice([-1, 0, 1]) 

        new_direction_value = current_direction_value + direction_change
        if new_direction_value < 1:
            new_direction_value = 8 
        elif new_direction_value > 8:
            new_direction_value = 1 

        self._direction = GeographicDirection(new_direction_value)

        logger.info(f"New wind: {self._speed} {self._direction}")

    @property 
    def get_speed(self) -> float:
        return self._speed

    @property
    def get_direction(self) -> GeographicDirection:
        return self._direction