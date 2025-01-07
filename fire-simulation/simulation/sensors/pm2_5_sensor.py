import logging
from datetime import datetime

from simulation.sensors.sensor import Sensor
from simulation.sensors.sensor_type import SensorType
from simulation.location import Location


class PM2_5Sensor(Sensor):
    _sensor_type: SensorType = SensorType.PM2_5

    def __init__(
        self,
        timestamp: datetime,
        location: Location,
        sensor_id: str,
    ):
        Sensor.__init__(self, timestamp, location, sensor_id)
        self._pm2_5 = None
        if not self._pm2_5:
            logging.warning(
                f"Sensor {self._sensor_id} of type {PM2_5Sensor.sensor_type} "
                f"is missing PM2.5 concentration data!"
            )

    @property
    def data(self):
        return {"pm2_5" : round(self._pm2_5, 2)}

    @property
    def unit(self) -> str:
        return {"pm2_5" : "ppm"}

    def next(self) -> None:
        pass

    def log(self) -> None:
        logging.debug(
            f'Sensor {self._sensor_id} of type {PM2_5Sensor.sensor_type} '
            f'reported PM2.5 concentration: {self._pm2_5:.2f} ppm.'
        )

    @property 
    def sensor_type(self):
        return self._sensor_type