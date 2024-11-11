import logging
from datetime import datetime
import json

from simulation import forest_map
from simulation.agent import MovingAgent
from simulation.forest_map import ForestMap
from simulation.location import Location
from simulation.agent_state import MOVING_AGENT_STATE


class FireBrigade(MovingAgent):
    def __init__(
        self,
        #forest_map: ForestMap, #think how to get it easily
        fire_brigade_id: str,
        timestamp: datetime,
        initial_state: MOVING_AGENT_STATE,
        base_location: Location,
        initial_location: Location,
    ):
        MovingAgent.__init__(self, forest_map, timestamp, base_location, initial_location)
        self._fire_brigade_id = fire_brigade_id
        self._state = initial_state
        self._destination = initial_location

    @property
    def fire_brigade_id(self) -> str:
        return self._fire_brigade_id

    @property
    def state(self) -> MOVING_AGENT_STATE:
        return self._state
    
    @property
    def destination(self) -> Location:
        return self._destination

    def set_fireBrigadeState(self, state: MOVING_AGENT_STATE):
        self._state = state


    @classmethod
    def from_conf(cls, conf):

        fire_brigades = []
        for val in conf["fireBrigades"]:
            fire_brigade_id=val["fireBrigadeId"],
            timestamp=val["timestamp"],
            initial_state=MOVING_AGENT_STATE.AVAILABLE,
            base_location=Location(**val["baseLocation"]),
            initial_location=Location(**val["currentLocation"]),
            destination=initial_location
            print(fire_brigade_id[0], timestamp, MOVING_AGENT_STATE(initial_state[0]), base_location, initial_location, destination)
            fire_brigades.append(cls(fire_brigade_id[0], timestamp, MOVING_AGENT_STATE.AVAILABLE, base_location, initial_location))

        return fire_brigades
    
    # @classmethod
    # def consumeFromQueue(cls, queue):
    #     fire_brigades = []
    #     for val in queue:
    #         fire_brigade_id=val["fireBrigadeId"],
    #         initial_state=val["state"],
    #         timestamp=val["timestamp"],
    #         initial_location=Location(**val["location"]),
    #         print(fire_brigade_id[0], initial_state, timestamp, initial_location)

    #         if initial_state == "TRAVELLING":
    #             base_location=Location(**val["baseLocation"]),
    #             destination=Location(**val["destination"])
    #         else:
    #             base_location = initial_location
    #             destination = initial_location
        
    #         fire_brigades.append(cls(fire_brigade_id, timestamp, FireBrigadeState(initial_state), base_location, initial_location, destination))
    
    #     return fire_brigades

    def next(self):
        pass

    def log(self) -> None:
        print(f'Fire brigade {self._fire_brigade_id} is in state: {self._state}.')
        logging.debug(f'Fire brigade {self._fire_brigade_id} is in state: {self._state}.')
