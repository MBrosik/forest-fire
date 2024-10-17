package pl.edu.agh.kis.firebackend.model.events;

import pl.edu.agh.kis.firebackend.model.primitives.Location;

import java.util.Date;

public record EvCO2Sensor(
    int sensorId,
    Date timestamp,
    SensorType sensorType,
    Location location,
    CO2SensorData data
) implements EvSensor<CO2SensorData> { }
