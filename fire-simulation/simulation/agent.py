from abc import ABC, abstractmethod
from datetime import datetime
#from typing import TypeAlias, Union

from simulation.sectors.sector import Sector
from simulation.agent_state import AGENT_STATE
# from simulation.forester_patrols.forester_patrol import ForesterPatrolState

from simulation.location import Location

#MovingAgentState: TypeAlias = Union[FireBrigadeState, ForesterPatrolState]


class Agent(ABC):
        
    def __init__(
        self,
        timestamp: datetime,
        base_location: Location,
        initial_location: Location,
        destination: Location = None,
    ):
        self._base_location = base_location
        self._destination = destination or base_location
        self._timestamp = timestamp
        self._location = initial_location
        self._state = AGENT_STATE.AVAILABLE

    @property
    def timestamp(self) -> datetime:
        return self._timestamp

    @property
    def location(self) -> Location:
        return self._location
    
    @property
    def base_location(self):
        return self._base_location
    
    @property
    def state(self):
        return self._state
    
    @property
    def destination(self):
        return self._destination
    
    @property
    @abstractmethod
    def getId(self) -> int:
        pass

    @abstractmethod
    def next(self) -> None:
        pass

    @abstractmethod
    def log(self):
        pass

    @abstractmethod
    def is_task_finished(self, sector : Sector) -> bool:
        pass

    @abstractmethod
    def increment_agents_in_sector(self, sector: Sector):
        pass

    @abstractmethod
    def decrement_agents_in_sector(self, sector: Sector):
        pass

    # def update_state(self, dest_sector : Sector):
    #     if self.state == AGENT_STATE.TRAVELLING:
    #         if(self.update_position()):
    #             if(self.destination == self.base_location):
    #                 self.set_state_available()
    #             else:
    #                 self.set_state_executing()
    #                 self.increment_agents_in_sector(dest_sector) 
    #     elif self.state == AGENT_STATE.EXECUTING:
    #         if(self.is_task_finished(dest_sector)):
    #             self.set_state_available()

    def set_state_available(self):
        self._state = AGENT_STATE.AVAILABLE

    def set_state_travelling(self, destination: Location):
        self._state = AGENT_STATE.TRAVELLING
        self._destination = destination

    def set_state_executing(self):
        self._state = AGENT_STATE.EXECUTING

    # def change_destination(self, new_destination: Location):
    #     self._destination = new_destination

    # def calculate_step(self, target: float, current: float, delta: float) -> float:
    #     if target > current:
    #         return min(delta, target - current)
    #     elif target < current:
    #         return max(-delta, target - current)
    #     return 0

    # def update_position(self) -> bool:
    #     self.location.latitude += self.calculate_step(self.destination.latitude, self.location.latitude, 0.1)
    #     self.location.longitude +=  self.calculate_step(self.destination.longitude, self.location.longitude, 0.1)
    #     return (
    #          abs(self.destination.latitude - self.location.latitude) <= 0.1 and
    #          abs(self.destination.longitude - self.location.longitude) <= 0.1
    #      )
