package pl.edu.agh.kis.firebackend.model.configuration;

import pl.edu.agh.kis.firebackend.model.primitives.Location;

import java.util.Date;

public record Camera(
    int cameraId,
    Location location,
    int range,
    Date timestamp
) { }
