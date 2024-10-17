import logging
from datetime import datetime

from simulation.cameras.camera_data import CameraData
from simulation.forest_map import ForestMap
from simulation.location import Location
from simulation.agent import SteadyAgent


class Camera(SteadyAgent):
    def __init__(
        self,
        forest_map: ForestMap,
        timestamp: datetime,
        initial_location: Location,
        camera_id: str,
        initial_data: CameraData,
    ) -> None:
        SteadyAgent.__init__(self, forest_map, timestamp, initial_location)
        self._camera_id = camera_id
        self._data = initial_data

    @property
    def camera_id(self) -> str:
        return self._camera_id

    @property
    def data(self) -> CameraData:
        return self._data

    def next(self):
        pass

    def log(self) -> None:
        logging.debug(f'Camera {self._camera_id} has data: {self._data}.')
