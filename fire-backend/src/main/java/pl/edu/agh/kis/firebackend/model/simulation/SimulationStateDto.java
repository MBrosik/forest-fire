package pl.edu.agh.kis.firebackend.model.simulation;

import pl.edu.agh.kis.firebackend.model.ForesterPatrol;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public record SimulationStateDto (
    String forestName,
    Date timestamp,
    List<Sector> sectors,
    List<FireBrigade> fireBrigades,
    List<ForesterPatrol> foresterPatrols
){
    public static SimulationStateDto from(SimulationState state) {
        return new SimulationStateDto(
                state.forestName,
                state.timestamp,
                new ArrayList<>(state.sectors.values()),
                new ArrayList<>(state.fireBrigades.values()),
                new ArrayList<>(state.foresterPatrols.values())
        );
    }

//    public static SimulationState fromConfiguration(Configuration configuration) {
//        return new SimulationState(
//                configuration.forestName(),
//                new Date(),
//                configuration.sectors().stream().map(Sector::fromConfig).toList()
//        );
//    }
}
