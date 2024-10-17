import logging
from datetime import datetime

from simulation.forest_map import ForestMap
from simulation.sensors.sensor import Sensor
from simulation.sensors.sensor_type import SensorType
from simulation.location import Location


class LitterMoistureSensor(Sensor):
    sensor_type: SensorType = SensorType.LITTER_MOISTURE

    def __init__(
        self,
        forest_map: ForestMap,
        timestamp: datetime,
        location: Location,
        sensor_id: str,
        initial_data: dict[str, float],
    ) -> None:
        Sensor.__init__(self, forest_map, timestamp, location, sensor_id)
        self._litter_moisture = initial_data.get('litter_moisture', None)
        if not self._litter_moisture:
            logging.warning(
                f"Sensor {self._sensor_id} of type {LitterMoistureSensor.sensor_type} "
                f"is missing litter moisture data!"
            )

    @property
    def litter_moisture(self) -> float:
        return self._litter_moisture

    def next(self) -> None:
        pass

    def log(self) -> None:
        logging.debug(
            f'Sensor {self._sensor_id} of type {LitterMoistureSensor.sensor_type} '
            f'reported litter moisture: {self._litter_moisture:.2f}%.'
        )