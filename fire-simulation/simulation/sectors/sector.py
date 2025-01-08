import random
from threading import Lock
import logging
from typing import List
import random
import json as jssonLib
from datetime import timedelta

from simulation.sensors.sensor import Sensor
from simulation.sectors.sector_state import SectorState
from simulation.sectors.sector_type import SectorType
from simulation.sectors.fire_state import FireState
from simulation.sensors.sensor_type import SensorType
from simulation.config import const
from simulation.fire_spread import coef_generator

from simulation.sensors.temperature_and_air_humidity_sensor import TemperatureAndAirHumiditySensor
from simulation.sensors.wind_speed_sensor import WindSpeedSensor
from simulation.sensors.wind_direction_sensor import WindDirectionSensor
from simulation.sensors.co2_sensor import CO2Sensor
from simulation.sensors.litter_moisture_sensor import LitterMoistureSensor
from simulation.sensors.pm2_5_sensor import PM2_5Sensor
from simulation.cameras.camera import Camera
from simulation.location import Location

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
        self._number_of_forester_patrols = 0
        self._sensors: List[Sensor] = []
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
    def fire_level(self) -> int:
        return self._fire_level

    @property
    def extinguish_level(self) -> int:
        return self._extinguish_level

    @property
    def burn_level(self) -> int:
        return self._burn_level
    
    @fire_level.setter
    def fire_level(self, fire):
        self._fire_level = fire

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
    def fire_state(self) -> FireState:
        return self._fire_state

    def add_sensor(self, sensor):
        self._sensors.append(sensor)

    def remove_sensor(self, sensor):
        self._sensors.remove(sensor)

    def start_fire(self):
        self._fire_level = random.randint(5, 20)
        self._fire_state = FireState.ACTIVE
        logger.info(f"Fire started in sector {self.sector_id} column:{self.column}, row:{self.row}.")

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

    # def update_sector_state(self):
    #     # Temperature increases based on fire level, but also considers the current state temperature.
    #     self._state.temperature = self._state.temperature + (self._fire_level * 0.8) - (self._state.temperature * 0.05)

    #     # Air humidity decreases as fire level increases, but also considers the current state humidity.
    #     self._state.air_humidity = max(self._state.air_humidity - self._fire_level * 0.5, 0)

    #     # CO2 concentration increases logarithmically with fire level, but also depends on current CO2 levels.
    #     self._state.co2_concentration = self._state.co2_concentration + (self._fire_level ** 1.2) - (self._state.co2_concentration * 0.01)

    #     # Plant litter moisture decreases sharply as fire level increases but also depends on its current state.
    #     self._state.plant_litter_moisture = max(self._state.plant_litter_moisture - self._fire_level * 0.6, 0)

    #     # PM2.5 concentration increases exponentially, but takes into account its current value.
    #     self._state.pm2_5_concentration = self._state.pm2_5_concentration + (self._fire_level ** 1.5 / 20) - (self._state.pm2_5_concentration * 0.02)

    #     # Wind speed mildly increases with fire level, considering current wind speed.
    #     self._state.wind_speed = self._state.wind_speed + (self._fire_level * 0.03) - (self._state.wind_speed * 0.01)    


    def update_sector_state(self):
        # Temperature increases with fire level, influenced by current state and random fluctuation.
        self._state.temperature = self._state.temperature + (self._fire_level * 0.8) - (self._state.temperature * 0.05) + random.uniform(-2, 2)
        print("====================================================")
        print(self._state.temperature)
        print("====================================================")

        # Air humidity decreases with fire level, with random variation simulating environmental factors.
        self._state.air_humidity = max(self._state.air_humidity - self._fire_level * 0.5 + random.uniform(-3, 3), 0)

        # CO2 concentration increases logarithmically with fire level, with slight randomness.
        self._state.co2_concentration = self._state.co2_concentration + (self._fire_level ** 1.2) - (self._state.co2_concentration * 0.01) + random.uniform(-10, 10)

        # Plant litter moisture decreases sharply as fire level increases, with random fluctuation.
        self._state.plant_litter_moisture = max(self._state.plant_litter_moisture - self._fire_level * 0.6 + random.uniform(-1, 1), 0)

        # PM2.5 concentration increases exponentially with random variation for unpredictable smoke dispersion.
        self._state.pm2_5_concentration = self._state.pm2_5_concentration + (self._fire_level ** 1.5 / 20) - (self._state.pm2_5_concentration * 0.02) + random.uniform(-0.5, 0.5)

        # Wind speed mildly increases with fire level and random fluctuation simulates gusts.
        self._state.wind_speed = self._state.wind_speed + (self._fire_level * 0.03) - (self._state.wind_speed * 0.01) + random.uniform(-0.3, 0.3)

        

        

    def update_sector(self):
        self.update_extinguish_level()
        self.update_fire_level()
        self.update_burn_level()
        self.update_sector_state()

    def update_sensors(self):
        for sensor in self.sensors:
            sensor._timestamp += timedelta(seconds=1)
            if isinstance(sensor, PM2_5Sensor):
                sensor._pm2_5 = self._state.pm2_5_concentration + random.uniform(-0.1, 0.1)
            elif isinstance(sensor, TemperatureAndAirHumiditySensor):                
                sensor._temperature = self._state.temperature + random.uniform(-5.0, 5.0)
                print("++++++++++++")
                print(f"sensor temperature is {sensor._temperature} while state temp is {self.state.temperature}")
                print("++++++++++++")
                sensor._humidity = self._state.air_humidity + random.uniform(-5.0, 5.0)
            elif isinstance(sensor, LitterMoistureSensor):
                sensor._litter_moisture = self._state.plant_litter_moisture + random.uniform(-5.0, 5.0)
            elif isinstance(sensor, CO2Sensor):
                sensor._co2 = self._state.co2_concentration + random.uniform(-5.0, 5.0)
            elif isinstance(sensor, WindSpeedSensor) :              
                sensor._wind_speed = self._state.wind_speed + random.uniform(-5.0, 5.0)
            elif isinstance(sensor, WindDirectionSensor):
                sensor._wind_direction = self._state.wind_direction
            elif isinstance(sensor, Camera):
                sensor._camera_data.smoke_detected = 1 if self.fire_level > 0 else 0
                sensor._camera_data.smoke_level = self.fire_level
                
    def make_jsons(self):
        jsons_by_type = {}

        for sensor in self.sensors:
            json = {
                "sensorId": sensor.sensor_id,
                "timestamp": sensor._timestamp.strftime('%Y-%m-%dT%H:%M:%S'),
                "sensorType": sensor.sensor_type.name,
                "location": {
                    "longitude": sensor._location.longitude,
                    "latitude": sensor._location.latitude,
                },
                "data": sensor.data
            }
            
            if sensor.sensor_type.name not in jsons_by_type:
                jsons_by_type[sensor.sensor_type.name] = []
            
            jsons_by_type[sensor.sensor_type.name].append(json)
        
        return jsons_by_type

    

