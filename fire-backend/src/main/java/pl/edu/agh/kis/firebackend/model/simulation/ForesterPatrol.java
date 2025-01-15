package pl.edu.agh.kis.firebackend.model.simulation;

import pl.edu.agh.kis.firebackend.model.primitives.Location;
import pl.edu.agh.kis.firebackend.model.ForesterPatrolState;
import pl.edu.agh.kis.firebackend.model.ForesterPatrolAction;
import pl.edu.agh.kis.firebackend.model.events.EvForestPatrol;
import pl.edu.agh.kis.firebackend.model.configuration.ConfForesterPatrol;

public record ForesterPatrol(
    int foresterPatrolId,
    int sectorId,
    Location location,
    ForesterPatrolState state,
    ForesterPatrolAction action
) {

    public static ForesterPatrol from(ConfForesterPatrol confForesterPatrol) {
        return new ForesterPatrol(
                confForesterPatrol.foresterPatrolId(),
                0,
                confForesterPatrol.currentLocation(),
                confForesterPatrol.state(),
                ForesterPatrolAction.PATROL
        );
    }

    public static ForesterPatrol from(EvForestPatrol evForestPatrol) {
        return new ForesterPatrol(
                evForestPatrol.foresterPatrolId(),
                0,
                evForestPatrol.location(),
                evForestPatrol.state(),
                ForesterPatrolAction.PATROL
        );
    }
}


