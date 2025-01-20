from simulation.fire_spread.wind import Wind
from simulation.sectors.sector_type import SectorType
from simulation.sectors.geographic_direction import GeographicDirection
from typing import Tuple

def calculate_beta(wind: Wind, target_sector_type: SectorType, direction: GeographicDirection) -> float:

    speed_coef = wind._speed / 40

    diff = abs(wind.get_direction.value - direction.value)
    diff = min(diff, 8 - diff)
    match diff:
        case 0:
            direction_coef = 0.8
        case 1:
            direction_coef = 0.5
        case 2:
            direction_coef = 0.25
        case 3:
            direction_coef = 0.1
        case 4:
            direction_coef = 0.05

    type_coef = calculate_alpha(target_sector_type)

    return min(speed_coef * type_coef * direction_coef, 1)


def calculate_alpha(sector_type: SectorType) -> float:

    if sector_type == SectorType.DECIDUOUS:
        type_coef = 0.8  # Lasy liściaste zmniejszają wpływ wiatru
    elif sector_type == SectorType.MIXED:
        type_coef = 1.0  # Lasy mieszane mają neutralny wpływ
    elif sector_type == SectorType.CONIFEROUS:
        type_coef = 1.2  # Lasy iglaste mogą wzmocnić wpływ wiatru
    elif sector_type == SectorType.FIELD:
        type_coef = 1.5  # Pole może być bardziej podatne na wiatr
    elif sector_type == SectorType.FALLOW:
        type_coef = 1.2  # Użytek może mieć zwiększoną odporność na wiatr
    elif sector_type == SectorType.WATER:
        type_coef = 0.5  # Woda zmniejsza wpływ wiatru
    elif sector_type == SectorType.UNTRACKED:
        type_coef = 1.0  # Obszar niezbadany ma neutralny wpływ wiatru
    
    return type_coef