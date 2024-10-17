package pl.edu.agh.kis.firebackend.model.simulation;

import lombok.AllArgsConstructor;
import pl.edu.agh.kis.firebackend.model.ForesterPatrol;
import pl.edu.agh.kis.firebackend.model.ForesterPatrolState;
import pl.edu.agh.kis.firebackend.model.configuration.Configuration;
import pl.edu.agh.kis.firebackend.model.primitives.Location;

import java.util.*;
import java.util.stream.Collectors;

@AllArgsConstructor
public class SimulationState {
    public String forestName;
    public Date timestamp;
    public Map<Integer, Sector> sectors;
    public Map<Integer, FireBrigade> fireBrigades;
    public Map<Integer, ForesterPatrol> foresterPatrols;


    public SimulationState() {
        this.forestName = "";
        this.timestamp = new Date();
        this.sectors = new HashMap<>();
        this.fireBrigades = new HashMap<>();
        this.foresterPatrols = new HashMap<>();
        this.foresterPatrols.put(1, new ForesterPatrol(1, new Date(), ForesterPatrolState.PATROLLING, new Location(1.0, 1.0), new Location(12.0, 12.0)));
    }

    public static SimulationState from(Configuration configuration) {
        Map<Integer, Sector> sectors = configuration
                .sectors()
                .stream()
                .collect(Collectors.toMap(sector -> sector.sectorId(), Sector::from));
        Map<Integer, FireBrigade>  fireBrigades = configuration
                .fireBrigades()
                .stream()
                .collect(Collectors.toMap(fireBrigade -> fireBrigade.fireBrigadeId(), FireBrigade::from));
        Map<Integer, ForesterPatrol> foresterPatrols = configuration
                .foresterPatrols()
                .stream()
                .collect(Collectors.toMap(foresterPatrol -> foresterPatrol.foresterPatrolId(), foresterPatrol -> foresterPatrol));

        return new SimulationState(
                configuration.forestName(),
                new Date(),
                sectors,
                fireBrigades,
                foresterPatrols
        );
    }
}
