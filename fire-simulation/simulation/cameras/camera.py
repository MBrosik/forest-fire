import logging
from datetime import datetime

from simulation.cameras.camera_data import CameraData
from simulation.location import Location
from simulation.sensors.sensor import Sensor
from simulation.sensors.sensor_type import SensorType


class Camera(Sensor):
    def __init__(
        self,
        timestamp: datetime,
        initial_location: Location,
        sensor_id: str,
    ) -> None:
        Sensor.__init__(self, timestamp, initial_location, sensor_id)
        self._camera_data = CameraData(0, 0, self._location)
        self._sensor_type = SensorType.CAMERA

    @property
    def sensor_id(self) -> str:
        return self._sensor_id
    
    @property
    def sensor_type(self) -> SensorType:
        return self._sensor_type

    @property
    def data(self) -> str:
        return {"smokeDetected" : self._camera_data.smoke_detected,
                "smokeLevel" : self._camera_data.smoke_level,
                "smokeLocation" : { "longitiude" : self._camera_data.smoke_location.longitude, 'latitiude' : self._camera_data.smoke_location.latitude}}
    
    def unit(self):
        pass

    def next(self):
        pass

    def log(self) -> None:
        logging.debug(f'Camera {self._camera_id} has data: {self._data}.')
