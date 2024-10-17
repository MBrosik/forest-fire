package pl.edu.agh.kis.firebackend.model.configuration;

import pl.edu.agh.kis.firebackend.model.ForesterPatrol;
import pl.edu.agh.kis.firebackend.model.primitives.Location;

import java.util.List;

public record Configuration(
    String forestId,
    String forestName,
    double width,
    double height,
    double sectorSize,
    String imageReference,
    List<Location> location,
    List<ConfSector> sectors,
    List<ConfSensor> sensors,
    List<Camera> cameras,
    List<ConfFireBrigade> fireBrigades,
    List<ForesterPatrol> foresterPatrols
) { }
