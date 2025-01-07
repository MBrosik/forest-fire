import logging
from datetime import datetime

from simulation.sensors.sensor import Sensor
from simulation.sensors.sensor_type import SensorType
from simulation.location import Location


class WindSpeedSensor(Sensor):
    _sensor_type: SensorType = SensorType.WIND_SPEED

    def __init__(
        self,        
        timestamp: datetime,
        location: Location,
        sensor_id: str,        
    ):
        Sensor.__init__(self, timestamp, location, sensor_id)
        self._wind_speed = None
        if not self._wind_speed:
            logging.warning(
                f"Sensor {self._sensor_id} of type {WindSpeedSensor.sensor_type} "
                f"is missing wind direction data!"
            )

    
    @property
    def data(self) -> float:
        return {"windSpeed": round(self._wind_speed, 2)}
    
    @property
    def unit(self) -> str:
        return {"windSpeed":"m/s"}

    def next(self) -> None:
        pass

    def log(self) -> None:
        logging.debug(
            f'Sensor {self._sensor_id} of type {WindSpeedSensor.sensor_type} '
            f'reported wind speed: {self._wind_speed:.2f} m/s.'
        )

    @property 
    def sensor_type(self):
        return self._sensor_type