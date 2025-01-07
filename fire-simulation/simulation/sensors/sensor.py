from abc import ABC, abstractmethod
from typing import Dict
from simulation.location import Location
from datetime import datetime
from simulation.sensors.sensor_type import SensorType 

class Sensor(ABC):
    def __init__(
        self,
        timestamp: datetime,
        location: Location,
        sensor_id: str,
    ):
        self._timestamp = timestamp
        self._location = location
        self._sensor_id = sensor_id

    @property
    def timestamp(self) -> int:        
        return self.timestamp

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
    def sensor_type(self) -> SensorType:
        pass

    @property
    @abstractmethod
    def data(self) -> Dict[str, float]:
        pass

    @property
    @abstractmethod
    def unit(self) -> Dict[str, str]:
        pass