import logging
from datetime import datetime

from simulation.forest_map import ForestMap
from simulation.sensors.sensor import Sensor
from simulation.sensors.sensor_type import SensorType
from simulation.location import Location


class PM2_5Sensor(Sensor):
    sensor_type: SensorType = SensorType.PM2_5

    def __init__(
            self,
            forest_map: ForestMap,
            timestamp: datetime,
            location: Location,
            sensor_id: str,
            initial_data: dict[str, float],
    ) -> None:
        Sensor.__init__(self, forest_map, timestamp, location, sensor_id)
        self._pm2_5 = initial_data.get('pm2_5', None)
        if not self._pm2_5:
            logging.warning(
                f"Sensor {self._sensor_id} of type {PM2_5Sensor.sensor_type} "
                f"is missing PM2.5 concentration data!"
            )

    @property
    def pm2_5(self) -> float:
        return self._pm2_5

    def next(self) -> None:
        pass

    def log(self) -> None:
        logging.debug(
            f'Sensor {self._sensor_id} of type {PM2_5Sensor.sensor_type} '
            f'reported PM2.5 concentration: {self._pm2_5:.2f} ppm.'
        )
