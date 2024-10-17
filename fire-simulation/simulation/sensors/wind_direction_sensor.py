import logging
from datetime import datetime

from simulation.forest_map import ForestMap
from simulation.sectors.sector import GeographicDirection
from simulation.sensors.sensor import Sensor
from simulation.sensors.sensor_type import SensorType
from simulation.location import Location


class WindDirectionSensor(Sensor):
    sensor_type: SensorType = SensorType.WIND_DIRECTION

    def __init__(
        self,
        forest_map: ForestMap,
        timestamp: datetime,
        location: Location,
        sensor_id: str,
        initial_data: dict[str, GeographicDirection],
    ) -> None:
        Sensor.__init__(self, forest_map, timestamp, location, sensor_id)
        self._wind_direction = initial_data.get('wind_direction', None)
        if not self._wind_direction:
            logging.warning(
                f"Sensor {self._sensor_id} of type {WindDirectionSensor.sensor_type} "
                f"is missing wind direction data!"
            )

    @property
    def wind_direction(self) -> GeographicDirection | None:
        return self._wind_direction

    def next(self) -> None:
        pass

    def log(self) -> None:
        logging.debug(
            f"Sensor {self._sensor_id} of type {WindDirectionSensor.sensor_type} "
            f"reported wind direction: {self._wind_direction}."
        )
