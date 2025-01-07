import logging
from datetime import datetime

from simulation.sensors.sensor import Sensor
from simulation.sensors.sensor_type import SensorType
from simulation.location import Location


class LitterMoistureSensor(Sensor):
    _sensor_type: SensorType = SensorType.LITTER_MOISTURE

    def __init__(
        self,
        timestamp: datetime,
        location: Location,
        sensor_id: str,
    ):
        Sensor.__init__(self, timestamp, location, sensor_id)
        self._litter_moisture = None
        if not self._litter_moisture:
            logging.warning(
                f"Sensor {self._sensor_id} of type {LitterMoistureSensor.sensor_type} "
                f"is missing litter moisture data!"
            )
    
    @property
    def unit(self):
        return {"litter_moisture" : "%"}
    
    @property
    def data(self):
        return {"liiter_moisture" : round(self._litter_moisture, 2)}

    def next(self) -> None:
        pass

    def log(self) -> None:
        logging.debug(
            f'Sensor {self._sensor_id} of type {LitterMoistureSensor.sensor_type} '
            f'reported litter moisture: {self._litter_moisture:.2f}%.'
        )

    @property 
    def sensor_type(self):
        return self._sensor_type