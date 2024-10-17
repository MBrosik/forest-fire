import logging
from datetime import datetime

from simulation.agent import MovingAgent
from simulation.forest_map import ForestMap
from simulation.forester_patrols.forester_patrol_state import ForesterPatrolState
from simulation.location import Location


class ForesterPatrol(MovingAgent):
    def __init__(
        self,
        forest_map: ForestMap,
        forester_patrol_id: str,
        timestamp: datetime,
        initial_state: ForesterPatrolState,
        base_location: Location,
        initial_location: Location
    ):
        MovingAgent.__init__(self, forest_map, timestamp, base_location, initial_location)
        self._forester_patrol_id = forester_patrol_id
        self._state = initial_state

    @property
    def forester_patrol_id(self) -> str:
        return self._forester_patrol_id

    @property
    def state(self) -> ForesterPatrolState:
        return self._state

    def next(self):
        pass

    def move(self) -> None:
        pass

    def log(self) -> None:
        logging.debug(f'Forester patrol {self._forester_patrol_id} is in state: {self._state}.')
