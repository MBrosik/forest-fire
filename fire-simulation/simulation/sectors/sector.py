import random
from threading import Lock
import logging

from simulation.sectors.sector_state import SectorState
from simulation.sectors.sector_type import SectorType
from simulation.sectors.fire_state import FireState
from simulation.config import const
from simulation.fire_spread import coef_generator

logger = logging.getLogger(__name__)


class Sector:
    def __init__(
        self,
        sector_id: int,
        row: int,
        column: int,
        sector_type: SectorType,
        initial_state: SectorState
    ):
        self.lock = Lock()
        self._sector_id = sector_id
        self._row = row
        self._column = column
        self._sector_type = sector_type
        self._state = initial_state
        self._extinguish_level = 0 #scale 0-100 - power of ex
        self._fire_level = 0 #scale 0-100 - size of fire
        self._burn_level = 0 #scale 0-100 - burned area
        self._number_of_fire_brigades = 0
        self._sensors = []
        self._fire_state = FireState.INACTIVE

    @property
    def sector_id(self) -> int:
        return self._sector_id

    @property
    def row(self) -> int:
        return self._row

    @property
    def column(self) -> int:
        return self._column
    
    @property
    def sector_type(self) -> SectorType:
        return self._sector_type

    @property
    def state(self) -> SectorState:
        return self._state

    @property
    def extinguish_level(self) -> int:
        return self._extinguish_level

    @property
    def burn_level(self) -> int:
        return self._burn_level

    @burn_level.setter
    def burn_level(self, burn):
        self._burn_level = burn

    @extinguish_level.setter
    def extinguish_level(self, extinguish):
        self._extinguish_level = extinguish

    @property
    def sensors(self):
        return self._sensors
    
    @property
    def fire_state(self):
        return self._fire_state

    def add_sensor(self, sensor):
        self._sensors.append(sensor)

    def remove_sensor(self, sensor):
        self._sensors.remove(sensor)

    def start_fire(self):
        self._burn_level = random.randint(0, 20)
        self._fire_state = FireState.ACTIVE
        logger.info(f"Fire started in sector {self.sector_id}")

    def update_extinguish_level(self):
        self._extinguish_level = self._number_of_fire_brigades * const.FIRE_FIGHTERS_MULTIPLIER
        logger.info(f"New extinguish level in sector {self._sector_id} is {self._extinguish_level}")

    def update_fire_level(self):
        fire_add = (self._fire_level/10) * coef_generator.calculate_alpha(self._sector_type) * const.FIRE_LEVEL_MULTIPLIER
        fire_sub = self._extinguish_level
        new_fire_level =  min(self._fire_level + fire_add - fire_sub, 100)
        if new_fire_level <= 0:
            self._fire_state = FireState.INACTIVE
            self._fire_level = 0
            logger.info(f"Sector {self._sector_id} is extinguished")
        else:
            self._fire_level = new_fire_level
        logger.info(f"New fire level in sector {self._sector_id} is {self._fire_level}")
        

    def update_burn_level(self):
        new_burn_level = min(self._burn_level + 0.00005 * self._fire_level**3, 100)
        if (new_burn_level >= 100):
            self._fire_state = FireState.LOST
            self._fire_level = 0
            self._extinguish_level = 0
            logger.info(f"Sector {self._sector_id} is lost!")
        self._burn_level = new_burn_level
        logger.info(f"New burn level in sector {self._sector_id} is {self._burn_level}")

    def update_sector(self):
        self.update_extinguish_level
        self.update_fire_level
        self.update_burn_level
    
    def update_sensors(self):
        # update sector state date regarding extingush and burn level

        for sensor in self._sensors:
            sensor['timestamp'] = sensor['timestamp'] + 1000
            if sensor['sensorType'] == "PM2_5":
                sensor['data'] = {
                    "pm2_5Concentration": self._state.pm2_5_concentration + random.uniform(-0.1, 0.1)
                }
            elif sensor['sensorType'] == "TEMPERATURE_AND_AIR_HUMIDITY":
                sensor['data'] = {
                    "temperature": self._state.temperature + random.uniform(-5.0, 5.0),
                    "airHumidity": self._state.air_humidity + random.uniform(-5.0, 5.0)
                }
            elif sensor['sensorType'] == "LITTER_MOISTURE":
                sensor['data'] = {
                    "plantLitterMoisture": self._state.plant_litter_moisture + random.uniform(-5.0, 5.0)
                }
            elif sensor['sensorType'] == "CO2":
                sensor['data'] = {
                    "co2Concentration": self._state.co2_concentration + random.uniform(-5.0, 5.0)
                }
            elif sensor['sensorType'] == "WIND_SPEED":
                sensor['data'] = {
                    "windSpeed": self._state.wind_speed + random.uniform(-5.0, 5.0)
                }
            elif sensor['sensorType'] == "WIND_DIRECTION":
                sensor['data'] = {
                    # only NE, NW, SE, SW
                    "windDirection": self._state.wind_direction
                }
            # print(sensor)

    def make_json(self, sensor, sensor_id):
        return {
            "sensorId": sensor_id,
            "timestamp": sensor['timestamp'],
            "sensorType": sensor['sensorType'],
            "location": {
                "longitude": sensor['location']['longitude'],
                "latitude": sensor['location']['latitude'],
            },
            "data": sensor['data']
        }