package pl.edu.agh.kis.firebackend.model.simulation;

import lombok.AllArgsConstructor;
import pl.edu.agh.kis.firebackend.model.SectorState;
import pl.edu.agh.kis.firebackend.model.configuration.ConfSector;

import java.util.List;

@AllArgsConstructor
public class Sector {
    public int sectorId;
    public SectorState state;
    public List<List<Double>> contours;

    public static Sector from(ConfSector confSector) {
        return new Sector(confSector.sectorId(), confSector.initialState(), confSector.contours());
    }
}
