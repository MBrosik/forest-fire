import logging
import random
from typing import List, Tuple

from threading import Thread
import time
import numpy as np
import json

from simulation.forest_map import ForestMap
from simulation.fire_brigades.fire_brigade import FireBrigade
from simulation.forester_patrols.forester_patrol import ForesterPatrol
from simulation.agent_state import MOVING_AGENT_STATE
from simulation.sectors.sector import Sector
from simulation.sectors.fire_state import FireState
from simulation.fire_spread.coef_generator import calculate_beta
from simulation.fire_spread.wind import Wind
from simulation.sectors.geographic_direction import GeographicDirection

from simulation.rabbitmq import producer, consumer, connection_manager
from simulation.rabbitmq.message_store import MessageStore
from simulation.sensors.sensor_type import SensorType

logger = logging.getLogger(__name__)

EXCHANGE_NAME = "fire_updates"
USERNAME = "guest"
PASSWORD = "guest"

WRITE_QUEUE_TOPICS = [
    "Forester patrol state topic",
    "Camera topic",
    "Temp and air humidity topic",
    "Wind speed topic",
    "Wind direction topic",
    "Litter moisture topic",
    "CO2 topic",
    "PM2.5 topic",
    "Fire brigades state topic"
]

READ_QUEUE_TOPICS = [
    "Forester patrol action queue",
    "Fire brigades action queue"
]

def get_topic_for_sensor(sensor_type: SensorType) -> str:
    # Indeksy odpowiadające typom sensorów w SensorType
    topic_mapping = {
        SensorType.TEMPERATURE_AND_AIR_HUMIDITY: WRITE_QUEUE_TOPICS[2],
        SensorType.WIND_SPEED: WRITE_QUEUE_TOPICS[3],
        SensorType.WIND_DIRECTION: WRITE_QUEUE_TOPICS[4],
        SensorType.LITTER_MOISTURE: WRITE_QUEUE_TOPICS[5],
        SensorType.PM2_5: WRITE_QUEUE_TOPICS[7],
        SensorType.CO2: WRITE_QUEUE_TOPICS[6],
    }
    return topic_mapping.get(sensor_type, "Unknown topic")



def run_simulation(configuration):
    store = MessageStore()
    read_threads = []
    write_threads = []
    
    #===================Get connection and channel===================

    while(1):
        connection, channel = connection_manager.create_queues(EXCHANGE_NAME, USERNAME, PASSWORD)
        logger.info("Queues have been created!")
        if(connection and channel):
            break
        logger.error("Error while connecting to RabbitMQ. Trying to reconnect.")
        time.sleep(5)

    #===================Threads with producing and consuming===================

    for index, queue in enumerate(WRITE_QUEUE_TOPICS):
        write_threads.append(Thread(target=producer.start_producing_messages, args=(EXCHANGE_NAME, queue, store, USERNAME, PASSWORD)))
        write_threads[index].start()
        logger.info(f"Producer for {queue} has started working.")
    
    for index, queue in enumerate(READ_QUEUE_TOPICS):
        read_threads.append(Thread(target=consumer.consume_messages_from_queue, args=( queue, store, USERNAME, PASSWORD)))
        read_threads[index].start()
        logger.info(f"Consumer for {queue} has started working.")
    
    #===================Get configuration===================

    map = ForestMap.from_conf(configuration)
    fire_brigades = FireBrigade.from_conf(configuration)  
    forest_patrols = ForesterPatrol.from_conf(configuration)

    #===================SIMULATION===================
    wind = Wind()

    all_sectors: List[Sector] = [item for sublist in map.sectors for item in sublist]

    sectors_on_fire: List[Sector] = []
    sectors_on_fire.append(map.start_new_fire())

    while True:

        for sector in sectors_on_fire:
            sector.update_sector()

            neighbours: List[Tuple[Sector, GeographicDirection]]
            neighbours = map.get_adjacent_sectors(sector) #all neighbours

            new_sectors_on_fire: List[Sector] = []
            for neighbour in neighbours:
                if(neighbour[0].fire_state is FireState.INACTIVE):
                    probability = calculate_beta(wind, neighbour[0].sector_type, neighbour[1]) 
                    if random.random() < probability:
                        neighbour[0].start_fire()
                        new_sectors_on_fire.append(neighbour[0])

                

        sectors_on_fire = list(filter(lambda sector: sector.fire_state is FireState.ACTIVE, sectors_on_fire))
        sectors_on_fire.extend(new_sectors_on_fire)        

        wind.update_wind()

        for sector in all_sectors:
            sector.update_sensors()
            
            for sector_type, jsons in sector.make_jsons().items():
                queue = get_topic_for_sensor(sector_type)
                for json in jsons:
                    store.add_message_to_sent(queue, json)
            

        time.sleep(5)

    
    # num_fire_brigades_available = len(fire_brigades)

    # # for row in map.sectors:
    # #     for column in row:
    # #         # print(column.sector_id)
    # #         print(column)

    # x_start = random.randint(1, len(map.sectors)-1)
    # y_start = random.randint(1, len(map.sectors[1])-1)

    # print(f"Starting position: {x_start}, {y_start}")
    # print(map.sectors.__len__(), map.sectors[1].__len__())
    # print(map.sectors[8][12])
    # sector = map.sectors[x_start][y_start]
    # sector.burn_level = 1
    # switcher = {
    #     "PM2_5": "pm25",
    #     "TEMPERATURE_AND_AIR_HUMIDITY": "tempAndAirHumidity",
    #     "LITTER_MOISTURE": "litterMoisture",
    #     "CO2": "co2",
    #     "WIND_SPEED": "windSpeed",
    #     "WIND_DIRECTION": "windDirection",
    #     "CAMERA": "camera"
    # }

    # # main simulation
    # for i in range(600000):
    #     old_sectors = map.sectors
    #     for row in old_sectors:
    #         for current_sector in row:
    #             if current_sector is None:
    #                 continue
    #             if current_sector.sector_type == 6:
    #                 continue

    #             # simulate fire extinguishing
    #             if current_sector.burn_level > 0:
    #                 extinguish = 0
    #                 # for fire_brigade in fire_brigades:
    #                 #     # TODO: TUTAJ IF: jeśli fire_brigade jest w danym sektorze
    #                 #     if fire_brigade.state == MOVING_AGENT_STATE.AVAILABLE or fire_brigade.state == MOVING_AGENT_STATE.EXTINGUISHING:
    #                 #         extinguish = extinguish + random.uniform(0.001, 0.02)
    #                 #         fire_brigade.set_fireBrigadeState(state = MOVING_AGENT_STATE.EXTINGUISHING)
    #                 #         break
    #                 #     fire_brigade.move()
    #                 map.sectors[current_sector.row][current_sector.column].extinguish_level += extinguish
    #                 map.sectors[current_sector.row][current_sector.column].state.temperature -= extinguish
    #                 map.sectors[current_sector.row][current_sector.column].state.air_humidity += extinguish
    #                 map.sectors[current_sector.row][current_sector.column].state.plant_litter_moisture += extinguish
    #                 map.sectors[current_sector.row][current_sector.column].state.temperature -= extinguish*5
    #                 map.sectors[current_sector.row][current_sector.column].state.co2_concentration -= extinguish*5
    #                 map.sectors[current_sector.row][current_sector.column].state.pm2_5_concentration -= extinguish*5

    #             if current_sector.burn_level > 0 and current_sector.burn_level < 100 and current_sector.extinguish_level < current_sector.burn_level:
    #                 additional_burn = random.uniform(0.001, 0.05)
    #                 # additional_burn = random.uniform(1, 5)
    #                 map.sectors[current_sector.row][current_sector.column].burn_level += additional_burn
    #                 map.sectors[current_sector.row][current_sector.column].burn_level = min(100, map.sectors[
    #                     current_sector.row][current_sector.column].burn_level)

    #                 map.sectors[current_sector.row][current_sector.column].state.pm2_5_concentration += additional_burn*10
    #                 map.sectors[current_sector.row][current_sector.column].state.temperature += additional_burn*5
    #                 map.sectors[current_sector.row][current_sector.column].state.co2_concentration += additional_burn*5
    #                 map.sectors[current_sector.row][current_sector.column].state.pm2_5_concentration += additional_burn*5

    #             elif current_sector.burn_level < 100 and current_sector.extinguish_level < 50:
    #                 neighbors = map.get_adjacent_sectors(current_sector, old_sectors)
    #                 neighbor_fire = False
    #                 for neighbor in neighbors:
    #                     if neighbor is None:
    #                         continue
    #                     if neighbor.burn_level > 20 and neighbor.burn_level > neighbor.extinguish_level:
    #                         neighbor_fire = True
    #                         break

    #                 if neighbor_fire:
    #                     additional_burn = random.uniform(0.1, 2)
    #                     map.sectors[current_sector.row][current_sector.column].burn_level += additional_burn
    #                     map.sectors[current_sector.row][current_sector.column].burn_level = min(100, map.sectors[
    #                         current_sector.row][current_sector.column].burn_level)

    #             map.sectors[current_sector.row][current_sector.column].update_sensors()

    #             print(current_sector.row, current_sector.column, map.sectors[current_sector.row][current_sector.column].sensors)
    #             # time.sleep(1)
    #             if len(map.sectors[current_sector.row][current_sector.column].sensors) > 0:
    #                 print("Sensor Type: " + map.sectors[current_sector.row][current_sector.column].sensors[0]['sensorType'])
    #                 print("Queue name: " + switcher.get(map.sectors[current_sector.row][current_sector.column].sensors[0]['sensorType']))
    #                 for sensor in map.sectors[current_sector.row][current_sector.column].sensors:
    #                     time.sleep(1)
    #                     print(json.dumps(map.sectors[current_sector.row][current_sector.column].make_json(sensor, sensor['sensorId'])))
    #                     producer.produce_message(EXCHANGE_NAME, channel, switcher.get(sensor['sensorType']),
    #                                     json.dumps(map.sectors[current_sector.row][current_sector.column].make_json(sensor, sensor['sensorId'])))

    #     time.sleep(2.0)

    #     #if i % 10 == 0:
    #         #visualize_fire(map)

    #     print('-----------------------')


    # # def callback_fire_brigade(ch, method, properties, body):
    # #     try:
    # #         # Dekodowanie wiadomości
    # #         message = json.loads(body.decode('utf-8'))
    # #         print(f"Received message: {message}")

    # #         # Przetwarzanie wiadomości
    # #         if 'fireBrigadeId' in message and 'action' in message:
    # #             fire_brigade_id = message['fireBrigadeId']
    # #             action = message['action']

    # #             # Znajdowanie odpowiedniej jednostki straży pożarnej
    # #             fire_brigade = next((fb for fb in fire_brigades if fb.id == fire_brigade_id), None)
    # #             if fire_brigade is not None:
    # #                 if action == 'move':
    # #                     destination = message.get('destination')
    # #                     if destination:
    # #                         fire_brigade.set_destination(destination)
    # #                         fire_brigade.set_state(MOVING_AGENT_STATE.TRAVELLING)
    # #                         print(f"Fire brigade {fire_brigade_id} is moving to {destination}")
    # #                 elif action == 'extinguish':
    # #                     fire_brigade.set_state(MOVING_AGENT_STATE.EXTINGUISHING)
    # #                     print(f"Fire brigade {fire_brigade_id} is extinguishing fire")
    # #                 elif action == 'return':
    # #                     fire_brigade.set_state(MOVING_AGENT_STATE.RETURNING)
    # #                     print(f"Fire brigade {fire_brigade_id} is returning to base")
    # #             else:
    # #                 print(f"Fire brigade with ID {fire_brigade_id} not found")
    # #         else:
    # #             print("Invalid message format")

    # #     except Exception as e:
    # #         print(f"Error processing message: {e}")