from dataclasses import dataclass

from simulation.agent import SteadyAgent
from simulation.cameras.camera import Camera
from simulation.fire_brigades.fire_brigade import FireBrigade
from simulation.forester_patrols.forester_patrol import ForesterPatrol
from simulation.location import Location
from simulation.sectors.sector import Sector


@dataclass()
class ForestConfiguration:
    forest_id: str
    forest_name: str
    width: int
    height: int
    sector_size: int
    location: list[Location]
    sectors: list[Sector]
    sensors: list[SteadyAgent]
    cameras: list[Camera]
    fire_brigades: list[FireBrigade]
    forester_patrols: list[ForesterPatrol]

    @classmethod
    def from_conf(cls, conf: dict):
        pass
        # forest_conf = ForestConfiguration(
        #     conf["forestId"],
        #     conf["forestName"],
        #     conf["width"],
        #     conf["height"]
        # )

