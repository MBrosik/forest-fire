import logging
from datetime import datetime

from simulation.agent import MovingAgent
from simulation.forest_map import ForestMap
from simulation.agent_state import MOVING_AGENT_STATE
from simulation.location import Location


class ForesterPatrol(MovingAgent):
    def __init__(
        self,
        forest_map: ForestMap,
        forester_patrol_id: str,
        timestamp: datetime,
        initial_state: MOVING_AGENT_STATE,
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
    def state(self) -> MOVING_AGENT_STATE:
        return self._state

    def next(self):
        pass

    def from_conf(cls, conf):
        forester_patrols = []
        for val in conf["foresterPatrols"]:
            forester_patrols.append(cls(
                forester_patrol_id=val["foresterPatrolId"],
                timestamp=val["timestamp"],
                initial_state=MOVING_AGENT_STATE.AVAILABLE,
                base_location=Location(**val["baseLocation"]),
                initial_location=Location(**val["currentLocation"])
            ))
        return forester_patrols

    def log(self) -> None:
        logging.debug(f'Forester patrol {self._forester_patrol_id} is in state: {self._state}.')
