package pl.edu.agh.kis.firebackend.model.configuration;

import pl.edu.agh.kis.firebackend.model.primitives.Location;
import pl.edu.agh.kis.firebackend.model.events.SensorType;

import java.util.Date;

public record ConfSensor(
    int sensorId,
    SensorType sensorType,
    Location location,
    Date timestamp
) {
}
