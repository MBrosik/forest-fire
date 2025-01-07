import logging
from datetime import datetime

from simulation.forest_map import ForestMap
from simulation.sensors.sensor import Sensor
from simulation.sensors.sensor_type import SensorType
from simulation.location import Location


class CO2Sensor(Sensor):
    _sensor_type: SensorType = SensorType.CO2

    def __init__(
        self,
        forest_map: ForestMap,
        timestamp: datetime,
        location: Location,
        sensor_id: str,
        initial_data: dict[str, float],
    ) -> None:
        Sensor.__init__(self, forest_map, timestamp, location, sensor_id)
        self._co2 = initial_data.get('co2', None)
        if not self._co2:
            logging.warning(
                f"Sensor {self._sensor_id} of type {CO2Sensor.sensor_type} "
                f"is missing CO₂ concentration data!"
            )

    @property
    def unit(self):
        return {"co2" : "μg/m³"}
    
    @property
    def data(self):
        return {"co2" : round(self._co2, 2)}

    def next(self) -> None:
        pass

    def log(self) -> None:
        logging.debug(
            f'Sensor {self._sensor_id} of type {CO2Sensor.sensor_type} '
            f'reported CO₂ concentration: {self._co2:.2f} μg/m³.'
        )

    @property 
    def sensor_type(self):
        return self._sensor_type