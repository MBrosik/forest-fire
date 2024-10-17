package pl.edu.agh.kis.firebackend.model.events;

import pl.edu.agh.kis.firebackend.model.primitives.Direction;

public record WindDirectionSensorData(
    Direction windDirection
) { }
