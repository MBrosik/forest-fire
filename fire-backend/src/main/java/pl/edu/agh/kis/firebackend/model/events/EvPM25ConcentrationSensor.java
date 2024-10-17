package pl.edu.agh.kis.firebackend.model.events;

import pl.edu.agh.kis.firebackend.model.primitives.Location;

import java.util.Date;

public record EvPM25ConcentrationSensor(
    int sensorId,
    Date timestamp,
    SensorType sensorType,
    Location location,
    PM25ConcentrationSensorData data
) implements EvSensor<PM25ConcentrationSensorData> { }
