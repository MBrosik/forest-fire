package pl.edu.agh.kis.firebackend.model.events;

import pl.edu.agh.kis.firebackend.model.primitives.Location;

import java.util.Date;

public record EvWindSpeedSensor(
    int sensorId,
    Date timestamp,
    SensorType sensorType,
    Location location,
    WindSpeedData data
) implements EvSensor<WindSpeedData> {}
