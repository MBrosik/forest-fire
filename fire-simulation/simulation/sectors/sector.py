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


    def update_sector_state(self):
        # Stałe współczynniki regulujące wpływ fire_level na różne parametry
        fire_influence = 0.5  # Wpływ poziomu pożaru na temperaturę
        cooling_factor = 0.02  # Naturalny spadek temperatury
        random_variation_temp = random.uniform(-0.5, 0.5)  # Zmniejszone losowe zmiany dla stabilności

        # Ograniczenie wartości fire_level do przedziału [0, 100] dla bezpieczeństwa
        self._fire_level = max(0, min(self._fire_level, 100))

        # Ustalona początkowa temperatura jako baza
        if not hasattr(self, '_initial_temperature'):
            self._initial_temperature = self._state.temperature

        # Docelowa temperatura zależna od fire_level w stosunku do początkowej wartości
        target_temperature = self._initial_temperature + (self._fire_level * 0.5)
        temperature_change = (target_temperature - self._state.temperature) * fire_influence

        # Uwzględnienie naturalnego chłodzenia i losowych fluktuacji
        self._state.temperature += temperature_change - (self._state.temperature * cooling_factor) + random_variation_temp
        self._state.temperature = max(10, min(self._state.temperature, self._initial_temperature + 80))  # Ograniczenie zakresu
        logger.info(f"Sector {self.sector_id} - Temperature: {self._state.temperature}")

        # Wilgotność powietrza – maleje wraz z pożarem, ale nie spada poniżej 5%
        humidity_change = self._fire_level * 0.4 + random.uniform(-2, 2)
        self._state.air_humidity -= humidity_change
        self._state.air_humidity = max(5, min(self._state.air_humidity, 100))
        logger.info(f"Sector {self.sector_id} - Air Humidity: {self._state.air_humidity}")

        # Stężenie CO2 – wzrost z ograniczonym wpływem losowości, kontrola wzrostu
        co2_change = (self._fire_level ** 1.1) - (self._state.co2_concentration * 0.01) + random.uniform(-5, 5)
        self._state.co2_concentration += co2_change
        self._state.co2_concentration = max(300, self._state.co2_concentration)  # Naturalny poziom CO2 minimum
        logger.info(f"Sector {self.sector_id} - CO2 Concentration: {self._state.co2_concentration}")

        # Wilgotność ściółki – gwałtowny spadek, ograniczenie przed całkowitym wysuszeniem
        litter_moisture_change = self._fire_level * 0.5 + random.uniform(-1, 1)
        self._state.plant_litter_moisture -= litter_moisture_change
        self._state.plant_litter_moisture = max(2, min(self._state.plant_litter_moisture, 100))
        logger.info(f"Sector {self.sector_id} - Plant Litter Moisture: {self._state.plant_litter_moisture}")

        # Stężenie PM2.5 – eksponencjalny wzrost ograniczony kontrolą
        pm_increase = (self._fire_level ** 1.3 / 25) - (self._state.pm2_5_concentration * 0.02) + random.uniform(-0.3, 0.3)
        self._state.pm2_5_concentration += pm_increase
        self._state.pm2_5_concentration = max(5, self._state.pm2_5_concentration)  # Minimalny poziom PM2.5
        logger.info(f"Sector {self.sector_id} - PM2.5 Concentration: {self._state.pm2_5_concentration}")

        # Prędkość wiatru – kontrolowany wzrost i fluktuacja dla realizmu
        wind_increase = (self._fire_level * 0.025) - (self._state.wind_speed * 0.01) + random.uniform(-0.2, 0.2)
        self._state.wind_speed += wind_increase
        self._state.wind_speed = max(0, min(self._state.wind_speed, 50))  # Ograniczenie prędkości wiatru
        logger.info(f"Sector {self.sector_id} - Wind Speed: {self._state.wind_speed}")


        

        

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
                sensor._temperature = self._state.temperature + random.uniform(-0.5, 0.5)
                logger.info(f"Temperature {sensor._temperature} in sensor_id {sensor._sensor_id} in sector {self.sector_id}")
                sensor._humidity = self._state.air_humidity + random.uniform(-0.5, 0.5)
            elif isinstance(sensor, LitterMoistureSensor):
                sensor._litter_moisture = self._state.plant_litter_moisture + random.uniform(-0.5, 0.5)
            elif isinstance(sensor, CO2Sensor):
                sensor._co2 = self._state.co2_concentration + random.uniform(-0.5, 0.5)
            elif isinstance(sensor, WindSpeedSensor) :              
                sensor._wind_speed = self._state.wind_speed + random.uniform(-0.5, 0.5)
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

    

