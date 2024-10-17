package pl.edu.agh.kis.firebackend.model;

import pl.edu.agh.kis.firebackend.model.primitives.Location;

import java.util.Date;

public record ForesterPatrol(
    int foresterPatrolId,
    Date timestamp,
    ForesterPatrolState state,
    Location baseLocation,
    Location currentLocation
) { }
