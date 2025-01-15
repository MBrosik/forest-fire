package pl.edu.agh.kis.firebackend.model;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonProperty;

import pl.edu.agh.kis.firebackend.model.primitives.Location;

public class OrderFireBrigade {
    @JsonProperty
    private int fireBrigadeId;
    @JsonProperty
    private FireBrigadeAction action;
    @JsonProperty
    private FireState fireState;
    @JsonProperty
    private Date timestamp;
    @JsonProperty
    private Location location;

    public OrderFireBrigade(int fireBrigadeId, FireBrigadeAction action, FireState fireState, Date timestamp, Location location) {
        this.fireBrigadeId = fireBrigadeId;
        this.action = action;
        this.fireState = fireState;
        this.timestamp = timestamp;
        this.location = location;
    }

    public OrderFireBrigade(int fireBrigadeId, FireBrigadeAction action, Date timestamp) {
        this(fireBrigadeId, action, null, timestamp, null);
    }

    public int fireBrigadeId() {
        return fireBrigadeId;
    }

    public FireBrigadeAction action() {
        return action;
    }

    public FireState fireState() {
        return fireState;
    }

    public Date timestamp() {
        return timestamp;
    }

    public Location location() {
        return location;
    }

    public void setForesterPatrolId(int fireBrigadeId) {
        this.fireBrigadeId = fireBrigadeId;
    }

    public void setAction(FireBrigadeAction action) {
        this.action = action;
    }

    public void setFireState(FireState fireState) {
        this.fireState = fireState;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    @Override
    public String toString() {
        return "OrderFireBrigade{" +
                "fireBrigadeId=" + fireBrigadeId +
                ", action=" + action +
                ", fireState=" + fireState +
                ", timestamp=" + timestamp +
                ", location=" + location +
                '}';
    }
}
