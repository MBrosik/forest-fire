import logging
import random

from threading import Thread
import time
import cv2
import numpy as np
import matplotlib.pyplot as plt
import pika
import json
from datetime import datetime, timezone

from simulation.forest_map import ForestMap
from simulation.fire_brigades.fire_brigade import FireBrigade
from simulation.fire_brigades.fire_brigade_state import FireBrigadeState
from simulation.fire_situation.fire_situation import FireSituation
from simulation.fire_situation.fire_situation_state import FireSituationState

logging.basicConfig(
    format='%(asctime)s %(levelname)-8s %(message)s',
    level=logging.INFO,
    datefmt='%Y-%m-%d %H:%M:%S'
)
image = cv2.imread('map.png')
cv2.imshow('image', image)
cv2.waitKey(1000)
cv2.destroyAllWindows()




def connection_prodcuer(exchange_name, username, password):
    try:
        CONNECTION_CREDENTIALS = pika.PlainCredentials(username, password)
        connection = pika.BlockingConnection(pika.ConnectionParameters('localhost', credentials=CONNECTION_CREDENTIALS))
        channel = connection.channel()
        channel.exchange_declare(exchange_name, durable=True, exchange_type='topic')

        channel.queue_declare(queue='tempAndAirHumidity')
        channel.queue_bind(exchange=exchange_name, queue='tempAndAirHumidity', routing_key='tempAndAirHumidity')

        channel.queue_declare(queue='windSpeed')
        channel.queue_bind(exchange=exchange_name, queue='windSpeed', routing_key='windSpeed')

        channel.queue_declare(queue='windDirection')
        channel.queue_bind(exchange=exchange_name, queue='windDirection', routing_key='windDirection')

        channel.queue_declare(queue='litterMoisture')
        channel.queue_bind(exchange=exchange_name, queue='litterMoisture', routing_key='litterMoisture')

        channel.queue_declare(queue='pm25')
        channel.queue_bind(exchange=exchange_name, queue='pm25', routing_key='pm25')

        channel.queue_declare(queue='co2')
        channel.queue_bind(exchange=exchange_name, queue='co2', routing_key='co2')

        channel.queue_declare(queue='camera')
        channel.queue_bind(exchange=exchange_name, queue='camera', routing_key='camera')

        channel.queue_declare(queue='fireBrigade')
        channel.queue_bind(exchange=exchange_name, queue='fireBrigade', routing_key='fireBrigade')

        channel.queue_declare(queue='foresterPatrol')
        channel.queue_bind(exchange=exchange_name, queue='foresterPatrol', routing_key='foresterPatrol')

        return connection, channel
    
    except Exception as e:
        print(f"Error connecting to RabbitMQ: {e}")
        return None, None

def message_producer(exchange, channel, routing_key, message):
    try:
        if channel is None:
            print("Channel is None")
            return
        print(f"Channel: {channel}")
        channel.basic_publish(exchange=exchange, routing_key=routing_key, body=message)
        print(f"Sent message: {message}")
    except Exception as e:
        print(f"Error sending message: {e}")

def closing_connection(connection):
    if connection is not None:
        connection.close()
        print("Connection closed")
    else:
        print("Connection is None")

def callback(ch, method, properties, body):
    data = json.loads(body.decode('utf-8'))
    print("Received message:", data)

# def connection_consumer(exchange_name, username, password):
#     CONNECTION_CREDENTIALS = pika.PlainCredentials(username, password)
#     connection = pika.BlockingConnection(pika.ConnectionParameters('localhost', port='5672', credentials=CONNECTION_CREDENTIALS))
#     channel = connection.channel()
    
#     channel.basic_consume(queue='fire-brigades-action', on_message_callback=on_message_received, auto_ack=True)

#     channel.basic_consume(queue='forest-patrol-action', on_message_callback=on_message_received, auto_ack=True)

#     Thread(target=channel.start_consuming).start()
#     return connection, channel

# use: 
# while True:
#     message_producer(exchange, channel, queue_name, message)


def main():
    
    map = ForestMap.from_conf("simulation/configurations/confD.json")
    fire_brigades = FireBrigade.from_conf("simulation/configurations/confD.json")
    
    EXCHANGE_NAME = "updates"
    USERNAME = "guest"
    PASSWORD = "guest"
    # WAITING FOR RABBITMQ SERVER
    connection, channel = connection_prodcuer(EXCHANGE_NAME, USERNAME, PASSWORD)
    if connection is None or channel is None:
        print("Connection failed")
        return
    print("Connection established")
    # connection, channel = connection_consumer(exchange_name, username, password)

    fire_situations = 0
    num_fire_brigades_available = len(fire_brigades)

    # for row in map.sectors:
    #     for column in row:
    #         # print(column.sector_id)
    #         print(column)

    x_start = random.randint(1, len(map.sectors)-1)
    y_start = random.randint(1, len(map.sectors[1])-1)

    print(f"Starting position: {x_start}, {y_start}")
    print(map.sectors.__len__(), map.sectors[1].__len__())
    print(map.sectors[8][12])
    sector = map.sectors[x_start][y_start]
    sector.burn_level = 1
    switcher = {
        "PM2_5": "pm25",
        "TEMPERATURE_AND_AIR_HUMIDITY": "tempAndAirHumidity",
        "LITTER_MOISTURE": "litterMoisture",
        "CO2": "co2",
        "WIND_SPEED": "windSpeed",
        "WIND_DIRECTION": "windDirection",
        "CAMERA": "camera"
    }

    # main simulation
    for i in range(600000):
        old_sectors = map.sectors
        for row in old_sectors:
            for current_sector in row:
                if current_sector is None:
                    continue
                if current_sector.sector_type == 6:
                    continue

                # simulate fire extinguishing
                if current_sector.burn_level > 0:
                    extinguish = 0
                    for fire_brigade in fire_brigades:
                        # TODO: TUTAJ IF: jeśli fire_brigade jest w danym sektorze
                        if fire_brigade.state == FireBrigadeState.AVAILABLE or fire_brigade.state == FireBrigadeState.EXTINGUISHING:
                            extinguish = extinguish + random.uniform(0.001, 0.02)
                            fire_brigade.set_fireBrigadeState(state = FireBrigadeState.EXTINGUISHING)
                            break
                        fire_brigade.move()
                    map.sectors[current_sector.row][current_sector.column].extinguish_level += extinguish
                    map.sectors[current_sector.row][current_sector.column].state.temperature -= extinguish
                    map.sectors[current_sector.row][current_sector.column].state.air_humidity += extinguish
                    map.sectors[current_sector.row][current_sector.column].state.plant_litter_moisture += extinguish
                    map.sectors[current_sector.row][current_sector.column].state.temperature -= extinguish*5
                    map.sectors[current_sector.row][current_sector.column].state.co2_concentration -= extinguish*5
                    map.sectors[current_sector.row][current_sector.column].state.pm2_5_concentration -= extinguish*5

                if current_sector.burn_level > 0 and current_sector.burn_level < 100 and current_sector.extinguish_level < current_sector.burn_level:
                    additional_burn = random.uniform(0.001, 0.05)
                    # additional_burn = random.uniform(1, 5)
                    map.sectors[current_sector.row][current_sector.column].burn_level += additional_burn
                    map.sectors[current_sector.row][current_sector.column].burn_level = min(100, map.sectors[
                        current_sector.row][current_sector.column].burn_level)

                    map.sectors[current_sector.row][current_sector.column].state.pm2_5_concentration += additional_burn*10
                    map.sectors[current_sector.row][current_sector.column].state.temperature += additional_burn*5
                    map.sectors[current_sector.row][current_sector.column].state.co2_concentration += additional_burn*5
                    map.sectors[current_sector.row][current_sector.column].state.pm2_5_concentration += additional_burn*5

                elif current_sector.burn_level < 100 and current_sector.extinguish_level < 50:
                    neighbors = map.get_adjacent_sectors(current_sector, old_sectors)
                    neighbor_fire = False
                    for neighbor in neighbors:
                        if neighbor is None:
                            continue
                        if neighbor.burn_level > 20 and neighbor.burn_level > neighbor.extinguish_level:
                            neighbor_fire = True
                            break

                    if neighbor_fire:
                        additional_burn = random.uniform(0.1, 2)
                        map.sectors[current_sector.row][current_sector.column].burn_level += additional_burn
                        map.sectors[current_sector.row][current_sector.column].burn_level = min(100, map.sectors[
                            current_sector.row][current_sector.column].burn_level)

                map.sectors[current_sector.row][current_sector.column].update_sensors()

                print(current_sector.row, current_sector.column, map.sectors[current_sector.row][current_sector.column].sensors)
                # time.sleep(1)
                if len(map.sectors[current_sector.row][current_sector.column].sensors) > 0:
                    print("Sensor Type: " + map.sectors[current_sector.row][current_sector.column].sensors[0]['sensorType'])
                    print("Queue name: " + switcher.get(map.sectors[current_sector.row][current_sector.column].sensors[0]['sensorType']))
                    for sensor in map.sectors[current_sector.row][current_sector.column].sensors:
                        time.sleep(1)
                        print(json.dumps(map.sectors[current_sector.row][current_sector.column].make_json(sensor, sensor['sensorId'])))
                        message_producer(EXCHANGE_NAME, channel, switcher.get(sensor['sensorType']),
                                        json.dumps(map.sectors[current_sector.row][current_sector.column].make_json(sensor, sensor['sensorId'])))

        time.sleep(2.0)

        if i % 10 == 0:
            visualize_fire(map)

        print('-----------------------')
    closing_connection(connection)



def visualize_fire(map: ForestMap):
    fire_sectors = np.zeros((len(map.sectors), len(map.sectors[1])))
    print("TEST")
    print(map.rows, map.columns)
    print(fire_sectors.shape)

    for row in range(1, len(map.sectors)):
        for column in range(1, len(map.sectors[1])):
            if map.sectors[row][column] is None:
                # print("Column is None: " + str(row))
                continue
            if map.sectors[row][column].burn_level > map.sectors[row][column].extinguish_level:
                # print(f"Row: {column.row}, Column: {column.column}, Burn level: {column.burn_level}")
                fire_sectors[row][column] = map.sectors[row][column].burn_level
            else:
                # print(f"Row: {column.row}, Column: {column.column}, Extinguish level: {column.extinguish_level}")
                fire_sectors[row][column] = -map.sectors[row][column].extinguish_level

    # for i in range(1, len(fire_sectors)):
    #     for j in range(1, len(fire_sectors[1])):
    #         print(f"Row: {i}, Column: {j}, Burn level: {fire_sectors[i][j]}")
    
    print(max(fire_sectors.flatten()), min(fire_sectors.flatten()))


    # Plot the heatmap
    plt.xticks(range(0, len(fire_sectors[1])-1), range(1, len(fire_sectors[1])))
    plt.yticks(range(0, len(fire_sectors)-1), range(1, len(fire_sectors)))
    # plt.imshow(image)
    plt.imshow(fire_sectors[1:,1:], cmap='bwr', alpha=0.5, interpolation='nearest', vmin=-100, vmax=100)


    plt.savefig('plot.png')

    plot = cv2.imread('plot.png')
    cv2.imshow('image', plot)
  
    # vmin = -100
    # vmax = 100
    # normalized_values = (fire_sectors - vmin) / (vmax - vmin)
    # normalized_values = np.clip(normalized_values, 0, 1)
    # normalized_values = cv2.normalize(fire_sectors, None, 0.0, 1.0, cv2.NORM_MINMAX)

    # heatmap = np.uint8(normalized_values * 255)
    # heatmap = cv2.normalize(heatmap, None, alpha=0, beta=255, norm_type=cv2.NORM_MINMAX, dtype=cv2.CV_8U)

    # # heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_AUTUMN)
    # heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_SUMMER)
    # window_size = (image.shape[1], image.shape[0])
    # overlay = cv2.addWeighted(image, 0.7, heatmap, 0.3, 0)
    # # cv2.imshow('Heatmap', overlay)

    # cv2.namedWindow('Heatmap', cv2.WINDOW_NORMAL)
    # cv2.resizeWindow('Heatmap', window_size)
    # cv2.imshow('Heatmap', overlay)

    cv2.waitKey(1000)
    cv2.destroyAllWindows()


if __name__ == '__main__':
    main()