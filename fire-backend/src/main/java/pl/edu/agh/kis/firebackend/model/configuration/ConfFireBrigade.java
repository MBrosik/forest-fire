package pl.edu.agh.kis.firebackend.model.configuration;

import pl.edu.agh.kis.firebackend.model.FireBrigadeState;
import pl.edu.agh.kis.firebackend.model.primitives.Location;

import java.util.Date;

public record ConfFireBrigade(
    int fireBrigadeId,
    Date timestamp,
    FireBrigadeState state,
    Location baseLocation,
    Location currentLocation
) { }
