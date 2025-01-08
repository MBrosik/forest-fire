from abc import ABC
from datetime import datetime
from simulation.agent_manager.action_type import FIREBRIGADE_ACTION, FORESTERPATROL_ACTION
from simulation.location import Location

class Order(ABC):
    def __init__(self, timestamp : datetime | None, location : Location | None):
        self._timestamp = timestamp
        self._location = location

class FireBrigadeOrder(Order):
    def __init__(self, fire_brigade_id, action : FIREBRIGADE_ACTION,  timestamp = None, location=None):
        
        self._fire_brigade_id = fire_brigade_id
        self._action = action
        super().__init__(timestamp, location)
        

class ForesterPatrolOrder(Order):
    def __init__(self, forester_patrol_id, action : FORESTERPATROL_ACTION, timestamp = None, location=None):
        
        self._forester_patrol_id = forester_patrol_id
        self._action = action
        super().__init__(timestamp, location)

    