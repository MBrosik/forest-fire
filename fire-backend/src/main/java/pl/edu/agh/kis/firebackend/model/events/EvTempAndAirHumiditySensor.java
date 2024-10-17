package pl.edu.agh.kis.firebackend.model.events;

import pl.edu.agh.kis.firebackend.model.primitives.Location;

import java.util.Date;

public record EvTempAndAirHumiditySensor(
    int sensorId,
    Date timestamp,
    SensorType sensorType,
    Location location,
    TempAndAirHumidityData data
) implements EvSensor<TempAndAirHumidityData> { }
