import logging
from datetime import datetime
import json

from simulation.sectors.sector import Sector
from simulation.agent import Agent
from simulation.location import Location
from simulation.agent_state import AGENT_STATE


class FireBrigade(Agent):
    def __init__(
        self,
        fire_brigade_id: str,
        timestamp: datetime,
        initial_state: AGENT_STATE,
        base_location: Location,
        initial_location: Location,
    ):
        Agent.__init__(self, timestamp, base_location, initial_location)
        self._fire_brigade_id = fire_brigade_id
        self._state = initial_state
        self._destination = initial_location

    @property
    def fire_brigade_id(self) -> str:
        return self._fire_brigade_id
    
    def is_task_finished(self, sector : Sector) -> bool:
        if sector.fire_level <= 0:
            return True
        else:
            return False 
        
    def increment_agents_in_sector(self, sector):
        sector._number_of_fire_brigades += 1

    def decrement_agents_in_sector(self, sector):
        sector._number_of_fire_brigades += 1

    @property
    def getId(self):
        return self.fire_brigade_id

    def next(self):
        pass

    def log(self) -> None:
        print(f'Fire brigade {self._fire_brigade_id} is in state: {self._state}.')
        logging.debug(f'Fire brigade {self._fire_brigade_id} is in state: {self._state}.')
