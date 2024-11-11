from abc import ABC, abstractmethod
from datetime import datetime
from typing import TypeAlias, Union

from simulation.sectors.sector import Sector
from simulation.agent_state import MOVING_AGENT_STATE
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

    def change_destination(self, new_destination: Location): # to wywołać jak dostaniemy nową lokalizację na kolejce strażaków
        self._destination = new_destination
        if abs(self._destination.row - self._location.row) <= 0.1 and abs(self._destination.column - self._location.column) <= 0.1:
            self._state = MOVING_AGENT_STATE.AVAILABLE
            print('Fire brigade has reached the destination.')

        else:
            self._state = MOVING_AGENT_STATE.TRAVELLING
        self.move()

    def move(self) -> None: # to w każdej pętli
        delta = 0.1

        if(self._state == MOVING_AGENT_STATE.TRAVELLING):
            # make location delta = 0.1
            if(self._destination.row > self._location.row):
                self._location.row += delta
            elif(self._destination.row < self._location.row):
                self._location.row -= delta
            if(self._destination.column > self._location.column):
                self._location.column += delta
            elif(self._destination.column < self._location.column):
                self._location.column -= delta

        if abs(self._destination.row - self._location.row) <= 0.1 and abs(self._destination.column - self._location.column) <= 0.1:
                self._state = MOVING_AGENT_STATE.AVAILABLE
                print('Fire brigade has reached the destination.')


        if next_destination is None:
            next_destination = self._destination

        if self._state == MOVING_AGENT_STATE.AVAILABLE and next_destination != None:
            self._state = MOVING_AGENT_STATE.TRAVELLING
            self._destination = next_destination
            print('Fire brigade is travelling to the fire.')
        
        elif self._state == MOVING_AGENT_STATE.TRAVELLING:
            if self._destination == self._base_location:
                self._state = MOVING_AGENT_STATE.AVAILABLE
                print('Fire brigade has returned to the base.')
            elif self._destination == self._initial_location:
                self._state = MOVING_AGENT_STATE.EXTINGUISHING
        
            if next_destination != None:
                self._destination = next_destination
        
        elif self._state == MOVING_AGENT_STATE.EXTINGUISHING:
            self._state = MOVING_AGENT_STATE.AVAILABLE
            self._destination = self._base_location

        self.log()


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
