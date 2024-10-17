from dataclasses import dataclass
from simulation.location import Location


@dataclass
class CameraData:
    smoke_detected: bool
    smoke_level: int
    smoke_location: Location

    def __str__(self) -> str:
        if self.smoke_level:
            return f'Smoke detected with level: {self.smoke_level}'
        else:
            return f'No smoke'
