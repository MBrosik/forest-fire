package pl.edu.agh.kis.firebackend.model;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonProperty;

import pl.edu.agh.kis.firebackend.model.primitives.Location;

public class OrderForesterPatrol {
    @JsonProperty
    private int foresterPatrolId;
    @JsonProperty
    private ForesterPatrolAction action;
    @JsonProperty
    private Date timestamp;
    @JsonProperty
    private Location location;

    public OrderForesterPatrol(int foresterPatrolId, ForesterPatrolAction action, Date timestamp, Location location) {
        this.foresterPatrolId = foresterPatrolId;
        this.action = action;
        this.timestamp = timestamp;
        this.location = location;
    }

    public OrderForesterPatrol(int foresterPatrolId, ForesterPatrolAction action, Date timestamp) {
        this(foresterPatrolId, action, timestamp, null);
    }

    public int fireBrigadeId() {
        return foresterPatrolId;
    }

    public ForesterPatrolAction action() {
        return action;
    }

    public Date timestamp() {
        return timestamp;
    }

    public Location location() {
        return location;
    }

    public void setForesterPatrolId(int fireBrigadeId) {
        this.foresterPatrolId = fireBrigadeId;
    }

    public void setAction(ForesterPatrolAction action) {
        this.action = action;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    @Override
    public String toString() {
        return "OrderForesterPatrol{" +
                "foresterPatrolId=" + foresterPatrolId +
                ", action=" + action +
                ", timestamp=" + timestamp +
                ", location=" + location +
                '}';
    }
}
