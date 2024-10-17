package pl.edu.agh.kis.firebackend.model.events;

import pl.edu.agh.kis.firebackend.model.primitives.Location;

import java.util.Date;

public record EvCamera(
    int cameraId,
    Date timestamp,
    Location location,
    Data data
) {
    public static record Data(
        boolean smokeDetected,
        int smokeLevel,
        Location smokeLocation
    ) {}
}
