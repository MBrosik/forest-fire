import json
import random

from simulation.sectors.sector import Sector
from typing import TypeAlias
from simulation.location import Location
from simulation.sectors.sector_state import SectorState
from simulation.sectors.sector_type import SectorType
from simulation.sectors.geographic_direction import GeographicDirection
from typing import Tuple, List
from simulation.sensors.sensor_type import SensorType
from simulation.sensors.temperature_and_air_humidity_sensor import TemperatureAndAirHumiditySensor
from simulation.sensors.wind_speed_sensor import WindSpeedSensor
from simulation.sensors.wind_direction_sensor import WindDirectionSensor
from simulation.sensors.co2_sensor import CO2Sensor
from simulation.sensors.litter_moisture_sensor import LitterMoistureSensor
from simulation.sensors.pm2_5_sensor import PM2_5Sensor
from datetime import datetime

ForestMapCornerLocations: TypeAlias = tuple[Location, Location, Location, Location]  # cw start upper left


class ForestMap:
    def __init__(
        self,
        forest_id: str,
        forest_name: str,
        rows: int,
        columns: int,
        location: ForestMapCornerLocations,
        sectors: list[list[Sector]]
    ):
        self._forest_id = forest_id
        self._forest_name = forest_name
        self._rows = rows
        self._columns = columns
        self._location = location
        self._sectors = sectors

    @classmethod
    def from_conf(cls, conf):
        # Przetwórz dane lokalizacji
        location = cls._parse_locations(conf["location"])

        # Przetwórz sektory
        sectors = cls._parse_sectors(conf)

        # Oblicz parametry mapy na podstawie lokalizacji
        bounds = cls._calculate_bounds(location, conf["rows"], conf["columns"])

        # Dodaj sensory do odpowiednich sektorów
        cls._assign_sensors_to_sectors(conf["sensors"], sectors, bounds)

        # Stwórz i zwróć obiekt ForestMap
        return cls(
            forest_id=conf["forestId"],
            forest_name=conf["forestName"],
            rows=conf["rows"],
            columns=conf["columns"],
            location=location,
            sectors=sectors
        )

    @staticmethod
    def _parse_locations(locations_conf):
        return tuple(Location(**location) for location in locations_conf)

    @staticmethod
    def _parse_sectors(conf):
        sectors = [[None for _ in range(conf["columns"])] for _ in range(conf["rows"])]
        for val in conf["sectors"]:
            initial_state = SectorState(
                temperature=val["initialState"]["temperature"],
                wind_speed=val["initialState"]["windSpeed"],
                wind_direction=GeographicDirection[val["initialState"]["windDirection"]],
                air_humidity=val["initialState"]["airHumidity"],
                plant_litter_moisture=val["initialState"]["plantLitterMoisture"],
                co2_concentration=val["initialState"]["co2Concentration"],
                pm2_5_concentration=val["initialState"]["pm2_5Concentration"],
            )
            sectors[val["row"]][val["column"]] = Sector(
                sector_id=val["sectorId"],
                row=val["row"],
                column=val["column"],
                sector_type=SectorType[val["sectorType"]],
                initial_state=initial_state,
            )
        return sectors

    @staticmethod
    def _calculate_bounds(locations, rows, columns):
        min_lat = min(location.latitude for location in locations)
        min_lon = min(location.longitude for location in locations)
        diff_lat = max(location.latitude for location in locations) - min_lat
        diff_lon = max(location.longitude for location in locations)
        return {
            "min_lat": min_lat,
            "min_lon": min_lon,
            "width_sectors": diff_lon / columns,
            "height_sectors": diff_lat / rows
        }

    @staticmethod
    def _assign_sensors_to_sectors(sensors, sectors, bounds):
        for sensor in sensors:
            sensor_obj = ForestMap._create_sensor(sensor)
            if not sensor_obj:
                continue

            sensor_location = Location(**sensor["location"])
            row = int((sensor_location.latitude - bounds["min_lat"]) / bounds["height_sectors"])
            column = int((sensor_location.longitude - bounds["min_lon"]) / bounds["width_sectors"])

            if 0 <= row < len(sectors) and 0 <= column < len(sectors[0]) and sectors[row][column]:
                sectors[row][column].add_sensor(sensor_obj)

    @staticmethod
    def _create_sensor(sensor_conf):
        sensor_arguments = {
            "timestamp": datetime.now(),
            "location": Location(sensor_conf["location"]["latitude"], sensor_conf["location"]["longitude"]),
            "sensor_id": sensor_conf["sensorId"],
        }
        match sensor_conf["sensorType"]:
            case "TEMPERATURE_AND_AIR_HUMIDITY":
                return TemperatureAndAirHumiditySensor(**sensor_arguments)
            case "WIND_SPEED":
                return WindSpeedSensor(**sensor_arguments)
            case "WIND_DIRECTION":
                return WindDirectionSensor(**sensor_arguments)
            case "LITTER_MOISTURE":
                return LitterMoistureSensor(**sensor_arguments)
            case "PM2_5":
                return PM2_5Sensor(**sensor_arguments)
            case "CO2":
                return CO2Sensor(**sensor_arguments)
            case _:
                return None



    # @classmethod
    # def from_conf(cls, conf):        

    #     locations = conf["location"]
    #     sectors_:list[list[Sector | None]] = [[None for _ in range(conf["columns"])] for _ in range(conf["rows"])]
    #     for val in conf["sectors"]:
    #         # print(val)
    #         initial_state = SectorState(
    #             temperature=val["initialState"]["temperature"],
    #             wind_speed=val["initialState"]["windSpeed"],
    #             wind_direction=val["initialState"]["windDirection"],
    #             air_humidity=val["initialState"]["airHumidity"],
    #             plant_litter_moisture=val["initialState"]["plantLitterMoisture"],
    #             co2_concentration=val["initialState"]["co2Concentration"],
    #             pm2_5_concentration=val["initialState"]["pm2_5Concentration"],
    #         )

    #         if SectorType[val["sectorType"]] is None:
    #             print(val["sectorType"])
    #         sectors_[val["row"]][val["column"]] = Sector(
    #             sector_id=val["sectorId"],
    #             row=val["row"],
    #             column=val["column"],
    #             sector_type= SectorType[val["sectorType"]],
    #             initial_state=initial_state,
    #         )



    #     values = {
    #         "forest_id": conf["forestId"],
    #         "forest_name": conf["forestName"],
    #         "rows": conf["rows"],
    #         "columns": conf["columns"],
    #         "location": (
    #             tuple(Location(**location) for location in locations)
    #         ),
    #         "sectors": sectors_
    #     }

    #     min_lat = min(location.latitude for location in values["location"])
    #     min_lon = min(location.longitude for location in values["location"])
    #     diff_lat = max(location.latitude for location in values["location"]) - min_lat
    #     diff_lon = max(location.longitude for location in values["location"]) - min_lon
    #     width_sectors = diff_lon / values["columns"]
    #     height_sectors = diff_lat / values["rows"]
        
    #     sensors = conf["sensors"]
    #     print(sensors)
        
    #     for sensor in sensors:

            
    #         sensor_arguments = {
    #             "timestamp" : datetime.now(),
    #             "location": Location(sensor["location"]["latitude"], sensor["location"]["longitude"]),
    #             "sensor_id": sensor["sensorId"],                
    #         }

            
        
    #         match sensor["sensorType"]:
    #             case "TEMPERATURE_AND_AIR_HUMIDITY":
    #                 sensor_class = TemperatureAndAirHumiditySensor(**sensor_arguments)
    #                 break
    #             case "WIND_SPEED":
    #                 sensor_class = WindSpeedSensor(**sensor_arguments)
    #                 break
    #             case "WIND_DIRECTION":
    #                 sensor_class = WindDirectionSensor(**sensor_arguments)
    #                 break
    #             case "LITTER_MOISTURE":
    #                 sensor_class = LitterMoistureSensor(**sensor_arguments)
    #                 break
    #             case "PM2_5":
    #                 sensor_class = PM2_5Sensor(**sensor_arguments)
    #                 break
    #             case "CO2":
    #                 sensor_class = CO2Sensor(**sensor_arguments)
    #                 break
    #             case _:
    #                 break                            
            
            
    #         sensor_location = Location(**sensor["location"])
    #         row = int((sensor_location.latitude - min_lat) / height_sectors) + 1
    #         column = int((sensor_location.longitude - min_lon) / width_sectors) + 1
    #         print(f"Adding sensor to sector {row} {column}")
    #         if row < 0 or row >= len(sectors_) or column < 0 or column >= len(sectors_[0]):                
    #             continue
    #         if sectors_[row][column] is not None:                        
    #             sectors_[row][column].add_sensor(sensor_class)
    #             print(f"Added sensor to sector {row} {column}")

    #     return ForestMap(**values)

    @property
    def forest_id(self) -> str:
        return self._forest_id

    @property
    def forest_name(self) -> str:
        return self._forest_name

    @property
    def rows(self) -> int:
        return self._rows

    @property
    def columns(self) -> int:
        return self._columns

    @property
    def location(self) -> ForestMapCornerLocations:
        return self._location

    @property
    def sectors(self) -> list[list[Sector]]:
        return self._sectors
    
    def start_new_fire(self) -> Sector:
        row = random.choice(self.sectors)
        sector = random.choice(row)

        #sector = self.sectors[6][6]

        sector.start_fire()

        return sector        
    
    def get_sector_with_max_burn_level(self) -> Sector:
        max_burn_level = 0
        max_burn_sector = None
        for row in self._sectors:
            for sector in row:
                if sector.burn_level > max_burn_level:
                    max_burn_level = sector.burn_level
                    max_burn_sector = sector
        return max_burn_sector
    
    def get_sector_location(self, sector: Sector) -> Location:

        return Location(
            longitude=self._location[0].longitude + sector.column * (self._location[1].longitude - self._location[0].longitude) / self._width,
            latitude=self._location[0].latitude + sector.row * (self._location[2].latitude - self._location[1].latitude) / self._height
        )
    
    def get_sector(self, sector_id: int) -> Sector:
        for row in self._sectors:
            for sector in row:
                if sector.sector_id == sector_id:
                    return sector
        return None

    def find_sector(self, location: Location):
        lat_interpolation = (
                (location.latitude - self._location[1].latitude)
                / (self._location[2].latitude - self._location[1].latitude)
        )
        lon_interpolation = (
                (location.longitude - self._location[0].longitude)
                / (self._location[1].longitude - self._location[0].longitude)
        )

        height_index = int(self._height * lat_interpolation)
        width_index = int(self._width * lon_interpolation)

        return self._sectors[height_index][width_index]

    def get_adjacent_sectors(self, sector: Sector) -> List[Tuple[Sector, GeographicDirection]]:
        row = sector.row
        column = sector.column
        adjacent_sectors = []

        directions = [
            (-1, 0, GeographicDirection.N),
            (-1, 1, GeographicDirection.NE),
            (0, 1, GeographicDirection.E),
            (1, 1, GeographicDirection.SE),
            (1, 0, GeographicDirection.S),
            (1, -1, GeographicDirection.SW),
            (0, -1, GeographicDirection.W),
            (-1, -1, GeographicDirection.NW)
        ]

        for delta_row, delta_column, direction in directions:
            new_row = row + delta_row
            new_column = column + delta_column

            if 0 <= new_row < len(self.sectors) and 0 <= new_column < len(self.sectors[new_row]):
                adjacent_sectors.append((self.sectors[new_row][new_column], direction))

        return adjacent_sectors
