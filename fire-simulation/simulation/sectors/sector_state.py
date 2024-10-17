from dataclasses import dataclass

from simulation.sectors.geographic_direction import GeographicDirection


@dataclass
class SectorState:
    temperature: float | None
    wind_speed: float | None
    wind_direction: GeographicDirection | None
    air_humidity: float | None  # in percents
    plant_litter_moisture: float | None  # in percents
    co2_concentration: float | None  # parts per million
    pm2_5_concentration: float | None  # micrograms per cubic meter
