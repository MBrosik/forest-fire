import logging
from datetime import datetime

from simulation.agent import Agent
from simulation.sectors.sector import Sector
from simulation.agent_state import AGENT_STATE
from simulation.location import Location


class ForesterPatrol(Agent):
    def __init__(
        self,
        forester_patrol_id: str,
        timestamp: datetime,
        initial_state: AGENT_STATE,
        base_location: Location,
        initial_location: Location
    ):
        Agent.__init__(self, timestamp, base_location, initial_location)
        self._forester_patrol_id = forester_patrol_id
        self._state = initial_state
        self._destination = initial_location

    @property
    def forester_patrol_id(self) -> str:
        return self._forester_patrol_id
    
    def increment_agents_in_sector(self, sector):
        sector._number_of_fire_brigades += 1

    def decrement_agents_in_sector(self, sector):
        sector._number_of_fire_brigades += 1

    @property
    def state(self) -> AGENT_STATE:
        return self._state
    
    @property
    def getId(self):
        return self.forester_patrol_id

    def next(self):
        pass
    
    def is_task_finished(self, sector : Sector) -> bool:
        return True

    def log(self) -> None:
        logging.debug(f'Forester patrol {self._forester_patrol_id} is in state: {self._state}.')
