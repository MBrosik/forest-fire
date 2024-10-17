package pl.edu.agh.kis.firebackend.model.simulation;

import pl.edu.agh.kis.firebackend.model.FireBrigadeAction;
import pl.edu.agh.kis.firebackend.model.FireBrigadeState;
import pl.edu.agh.kis.firebackend.model.configuration.ConfFireBrigade;
import pl.edu.agh.kis.firebackend.model.events.EvFireBrigade;
import pl.edu.agh.kis.firebackend.model.primitives.Location;

public record FireBrigade(
    int fireBrigadeId,
    int sectorId,
    Location location,
    FireBrigadeState state,
    FireBrigadeAction action
) {
    public static FireBrigade from(ConfFireBrigade confFireBrigade) {
        return new FireBrigade(
                confFireBrigade.fireBrigadeId(),
                0,
                confFireBrigade.currentLocation(),
                confFireBrigade.state(),
                FireBrigadeAction.EXTINGUISHING
        );
    }

    public static FireBrigade from(EvFireBrigade evFireBrigade) {
        return new FireBrigade(
                evFireBrigade.fireBrigadeId(),
                0,
                evFireBrigade.location(),
                evFireBrigade.state(),
                FireBrigadeAction.EXTINGUISHING
        );
    }
}
