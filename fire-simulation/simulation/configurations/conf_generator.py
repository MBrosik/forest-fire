import json
from datetime import datetime


def main():
    sensors = []
    for i in range(3):
        for j in range(3):
            sensors.append({
              "sensorId": 3*j + i,
              "sensorType": 1,
              "location": {
                "longitude": 50.5 + i,
                "latitude": 50.5 + j
              },
              "timestamp": str(datetime.now)
            })

    sectors = []

    for i in range(3):
        for j in range(3):
            sectors.append({
                "sectorId": 3*j + i,
                "row": i,
                "column": j,
                "sectorType": 2,
                "initialState": {
                    "temperature": 20,
                    "windSpeed": 0,
                    "windDirection": 0,
                    "airHumidity": 0,
                    "plantLitterMoisture": 0,
                    "co2Concentration": 0,
                    "pm2_5Concentration": 0
                }
            })

    fireBrigades = []

    for i in range(3):
        fireBrigades.append({
            "fireBrigadeId": i,
            "timestamp": str(datetime.now),
            "initialState": 1,
            "baseLocation": {
                "longitude": 50.0,
                "latitude": 50.0
            },
            "initialLocation": {
                "longitude": 50.0,
                "latitude": 50.0
            },
            "destination": {
                "longitude": 50.0,
                "latitude": 50.0
            }
        })

    configuration = {
        "forestId": "test_forest",
        "forestName": "test_forest",
        "width": 3,
        "height": 3,
        "sectorSize": 1000,
        "location": [
            {
              "longitude": 50.,
              "latitude": 50.,
            },
            {
              "longitude": 53.,
              "latitude": 50.,
            },
            {
              "longitude": 53.,
              "latitude": 53.
            },
            {
              "longitude": 50.,
              "latitude": 53.
            }
        ],
        "sectors": sectors,
        "sensors": sensors,
        "cameras": [],
        "fireBrigades": fireBrigades,
        "foresterPatrols": []
    }

    for item in configuration.values():
        print(type(item))

    with open("test_conf.json", "w") as fp:
        json.dump(configuration, fp, indent=4)


if __name__ == '__main__':
    main()
