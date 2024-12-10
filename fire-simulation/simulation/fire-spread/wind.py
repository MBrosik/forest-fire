import random
from sectors.geographic_direction import GeographicDirection

class Wind:

    def __init__(self):
        self._speed = random.uniform(0, 32)
        self._direction = random.choice(GeographicDirection)
    
    def update_wind(self):
        # Stopniowa zmiana prędkości wiatru - losowa zmiana o wartość +/- 5 km/h
        change_in_speed = random.uniform(-2.5, 2.5)
    
        self._speed = max(0, self._speed + change_in_speed)  # Prędkość nie może spaść poniżej 0
        
        # Stopniowa zmiana kierunku - losowy ruch w kierunkach sąsiednich
        current_direction_value = self._direction.value
        direction_change = random.choice([-1, 0, 1])  # Zmiana o -1, 0 lub 1

        # Aktualizacja kierunku, zapewniając, że nie wyjdzie poza zakres (1-8)
        new_direction_value = current_direction_value + direction_change
        if new_direction_value < 1:
            new_direction_value = 8  # Jeśli poniżej 1, ustaw na NW
        elif new_direction_value > 8:
            new_direction_value = 1  # Jeśli powyżej 8, ustaw na N

        # Przypisanie nowego kierunku
        self._direction = GeographicDirection(new_direction_value)
        
    def get_speed(self) -> float:
        return self._speed

    def get_direction(self) -> GeographicDirection:
        return self._direction