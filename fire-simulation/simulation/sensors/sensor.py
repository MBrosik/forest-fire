from abc import ABC, abstractmethod
from typing import Dict
from simulation.location import Location
from datetime import datetime
from simulation.agent import SteadyAgent
from simulation.sensors.sensor_type import SensorType 
from ..forest_map import ForestMap


class Sensor(SteadyAgent, ABC):
    def __init__(
        self,
        forest_map: ForestMap,
        timestamp: datetime,
        location: Location,
        sensor_id: str,
    ) -> None:
        SteadyAgent.__init__(self, forest_map, timestamp, location)
        self._sensor_id = sensor_id

    @property
    def sensor_id(self) -> str:
        return self._sensor_id

    @abstractmethod
    def next(self) -> None:
        pass

    @abstractmethod
    def log(self) -> None:
        pass

    @property
    @abstractmethod
    def sensor_type(self) -> str:
        pass

    @property
    @abstractmethod
    def data(self) -> Dict[str, float]:
        pass

    @property
    @abstractmethod
    def unit(self) -> Dict[str, str]:
        pass