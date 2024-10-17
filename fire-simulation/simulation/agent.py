from abc import ABC, abstractmethod
from datetime import datetime
from typing import TypeAlias, Union

from simulation.sectors.sector import Sector
# from simulation.fire_brigades.fire_brigade_state import FireBrigadeState
# from simulation.forester_patrols.forester_patrol import ForesterPatrolState

from simulation.forest_map import ForestMap
from simulation.location import Location

# MovingAgentState: TypeAlias = Union[FireBrigadeState, ForesterPatrolState]


class Agent(ABC):
    def __init__(self, forest_map: ForestMap, timestamp: datetime, initial_location: Location) -> None:
        self._timestamp = timestamp
        self._location = initial_location
        self._forest_map = forest_map

    @property
    def timestamp(self) -> datetime:
        return self._timestamp

    @property
    def location(self) -> Location:
        return self._location

    @property
    def forest_map(self):
        return self._forest_map

    def find_sector(self) -> Sector:
        pass

    @abstractmethod
    def next(self) -> None:
        pass

    @abstractmethod
    def log(self):
        pass


class MovingAgent(Agent, ABC):
    def __init__(
        self,
        forest_map: ForestMap,
        timestamp: datetime,
        base_location: Location,
        initial_location: Location,
        destination: Location
    ):
        self._base_location = base_location
        self._destination = destination
        Agent.__init__(self, forest_map, timestamp, initial_location)

    def __init__(
            self,
            forest_map: ForestMap,
            timestamp: datetime,
            base_location: Location,
            initial_location: Location,
    ):
        self._base_location = base_location
        self._destination = base_location
        Agent.__init__(self, forest_map, timestamp, initial_location)

    @property
    def base_location(self):
        return self._base_location

    @abstractmethod
    def move(self) -> None:
        pass


class SteadyAgent(Agent, ABC):
    def __init__(
        self,
        forest_map: ForestMap,
        timestamp: datetime,
        initial_location: Location
    ):
        Agent.__init__(self, forest_map, timestamp, initial_location)
        self._sector = forest_map.find_sector(initial_location)
        self._adjacent_sectors = forest_map.get_adjacent_sectors(self._sector)

    @abstractmethod
    def log(self) -> None:
        pass


def agent_worker(
        agent: Agent
) -> None:
    while True:
        agent.next()
