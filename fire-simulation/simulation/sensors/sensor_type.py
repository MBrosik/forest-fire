from enum import Enum


class SensorType(Enum):
    TEMPERATURE_AND_AIR_HUMIDITY = 1
    WIND_SPEED = 2
    WIND_DIRECTION = 3
    LITTER_MOISTURE = 4
    PM2_5 = 5
    CO2 = 6
    CAMERA = 7
