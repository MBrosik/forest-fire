from datetime import datetime
import logging

from .sensor import Sensor
from .sensor_type import SensorType
from ..forest_map import ForestMap
from ..location import Location


class TemperatureAndAirHumiditySensor(Sensor):
    sensor_type: SensorType = SensorType.TEMPERATURE_AND_AIR_HUMIDITY

    def __init__(
            self,
            forest_map: ForestMap,
            timestamp: datetime,
            location: Location,
            sensor_id: str,
            initial_data: dict[str, float]
    ):
        Sensor.__init__(self, forest_map, timestamp, location, sensor_id)
        self._temperature = initial_data.get("temperature", None)
        self._humidity = initial_data.get("humidity", None)

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
    def temperature(self):
        return self._temperature

    @property
    def humidity(self):
        return

    def next(self) -> None:
        pass

    def log(self) -> None:
        logging.debug(
            f"Sensor {self._sensor_id} of type {TemperatureAndAirHumiditySensor.sensor_type} "
            f"reported temperature: {self._temperature:.2f} °C and air humidity: {self._temperature:.2f}%."
        )
