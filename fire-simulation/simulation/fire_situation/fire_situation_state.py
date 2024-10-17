from enum import Enum

class FireSituationState(Enum):
    ACTIVE = 1
    BRIGADE_COMING = 2
    LOST = 3
    EXTINGUISHED = 4
    UNKNOWN = 5