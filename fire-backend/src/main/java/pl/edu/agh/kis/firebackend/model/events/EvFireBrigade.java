package pl.edu.agh.kis.firebackend.model.events;

import pl.edu.agh.kis.firebackend.model.FireBrigadeState;
import pl.edu.agh.kis.firebackend.model.primitives.Location;

import java.util.Date;

public record EvFireBrigade(
    int fireBrigadeId,
    FireBrigadeState state,
    Date timestamp,
    Location location
) { }
