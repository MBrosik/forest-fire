package pl.edu.agh.kis.firebackend.model;

import pl.edu.agh.kis.firebackend.model.primitives.Location;

import java.util.Date;

record CameraData(
    boolean smokeDetected,
    double smokeLevel,
    Location smokeLocation
) {}

public record Camera(
    int cameraId,
    Date timestamp,
    Location location
) {}
