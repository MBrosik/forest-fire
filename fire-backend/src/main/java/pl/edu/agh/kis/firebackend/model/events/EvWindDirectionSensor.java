package pl.edu.agh.kis.firebackend.model.events;

import pl.edu.agh.kis.firebackend.model.primitives.Location;

import java.util.Date;

public record EvWindDirectionSensor(
    int sensorId,
    Date timestamp,
    SensorType sensorType,
    Location location,
    WindDirectionSensorData data
) implements EvSensor<WindDirectionSensorData> { }
