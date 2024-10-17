package pl.edu.agh.kis.firebackend.model;

import lombok.AllArgsConstructor;
import pl.edu.agh.kis.firebackend.model.primitives.Direction;

import java.util.Date;

@AllArgsConstructor
public class SectorState {
    public Date timestamp;
    public double temperature;
    public double windSpeed;
    public Direction windDirection;
    public double airHumidity;
    public double plantLitterMoisture;
    public double co2Concentration;
    public double pm2_5Concentration;
    ThreatLevel threatLevel;
    FireState fireState;
}
