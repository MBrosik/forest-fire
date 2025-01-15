package pl.edu.agh.kis.firebackend.model.configuration;

import java.util.Date;

import pl.edu.agh.kis.firebackend.model.ForesterPatrolState;
import pl.edu.agh.kis.firebackend.model.primitives.Location;

public record ConfForesterPatrol(
    int foresterPatrolId,
    Date timestamp,
    ForesterPatrolState state,
    Location baseLocation,
    Location currentLocation
) { }
