from datetime import datetime
import logging

from .sensor import Sensor
from .sensor_type import SensorType
from ..location import Location


class TemperatureAndAirHumiditySensor(Sensor):
    _sensor_type: SensorType = SensorType.TEMPERATURE_AND_AIR_HUMIDITY

    def __init__(
        self,
        timestamp: datetime,
        location: Location,
        sensor_id: str
    ):
        Sensor.__init__(self, timestamp, location, sensor_id)
        self._temperature = None
        self._humidity = None
        if not self._temperature:
            logging.warning(
                f"Sensor {self._sensor_id} of type {TemperatureAndAirHumiditySensor.sensor_type} "
                f"is missing temperature data!"
            )

        if not self._humidity:
            logging.warning(
                f"Sensor {self._sensor_id} of type {TemperatureAndAirHumiditySensor.sensor_type} "
                f"is missing air humidity data!"
            )

    @property
    def data(self):
        return {"temperature" : round(self._temperature, 2), "humidity" : round(self._humidity, 2)}
    
    @property
    def unit(self):
        return {"temperature" : "°C", "humidity" : "%"}


    def next(self) -> None:
        pass

    def log(self) -> None:
        logging.debug(
            f"Sensor {self._sensor_id} of type {TemperatureAndAirHumiditySensor.sensor_type} "
            f"reported temperature: {self._temperature:.2f} °C and air humidity: {self._temperature:.2f}%."
        )

    @property 
    def sensor_type(self):
        return self._sensor_type