package pl.edu.agh.kis.firebackend.util;

import lombok.AllArgsConstructor;
import pl.edu.agh.kis.firebackend.model.primitives.Location;
import pl.edu.agh.kis.firebackend.model.simulation.Sector;

import java.util.List;
import java.util.Optional;

public class SectorIdResolver {
    public static Optional<Integer> resolveSectorId(List<Sector> sectors, Location location) {
        return sectors.stream().filter(sector -> {
            Bounds bounds = calculateBounds(sector);
            return locationInBounds(bounds, location);
        }).findFirst().map(sector -> sector.sectorId);
    }

    @AllArgsConstructor
    private static class Bounds {
        public double east;
        public double north;
        public double south;
        public double west;
    }

    private static Bounds calculateBounds(Sector sector) {
        Bounds acc = new Bounds(Double.POSITIVE_INFINITY, Double.NEGATIVE_INFINITY, Double.POSITIVE_INFINITY, Double.NEGATIVE_INFINITY);
        for (List<Double> contour : sector.contours) {
            Double longitude = contour.get(0);
            Double latitude = contour.get(1);

            if (longitude < acc.east) {
                acc.east = longitude;
            }
            if (latitude > acc.north) {
                acc.north = latitude;
            }
            if (latitude < acc.south) {
                acc.south = latitude;
            }
            if (longitude > acc.west) {
                acc.west = longitude;
            }
        }
        return acc;
    }

    private static boolean locationInBounds(Bounds bounds, Location location) {
        return (
            bounds.east < location.longitude() &&
            location.longitude() < bounds.west &&
            bounds.south < location.latitude() &&
            location.latitude() < bounds.north
        );
    }
}
