package pl.edu.agh.kis.firebackend.model.configuration;

import pl.edu.agh.kis.firebackend.model.SectorState;

import java.util.List;

public record ConfSector(
    int sectorId,
    int row,
    int column,
    SectorState initialState,
    List<List<Double>> contours
) {
}
