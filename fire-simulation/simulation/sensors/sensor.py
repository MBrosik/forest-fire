from abc import ABC, abstractmethod

from simulation.location import Location
from datetime import datetime
from simulation.agent import SteadyAgent
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
