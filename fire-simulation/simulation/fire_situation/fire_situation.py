from datetime import datetime

from simulation.fire_situation.fire_situation_state import FireSituationState

class FireSituation:
    def __init__(
            self, 
            fire_situation_id: str,
            fire_situation_state: FireSituationState,
            fire_brigade_id: str,
            sector_id: int,
            burn_level: int,
            extinguish_level: int,
            timestamp: datetime):
        self._fire_situation_id = fire_situation_id
        self._fire_situation_state = fire_situation_state
        self._fire_brigade_id = fire_brigade_id
        self._sector_id = sector_id
        self._burn_level = burn_level
        self._extinguish_level = extinguish_level
        self._timestamp = timestamp

    @property
    def fire_situation_state(self) -> str:
        return self._fire_situation_state
    
    @property
    def fire_brigade_id(self) -> str:
        return self._fire_brigade_id
    
    @property
    def burn_level(self) -> int:
        return self._burn_level
    
    @property
    def extinguish_level(self) -> int:
        return self._extinguish_level