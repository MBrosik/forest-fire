package pl.edu.agh.kis.firebackend.model.frontend;

import pl.edu.agh.kis.firebackend.model.primitives.Location;

public class FrontOrderPatrol extends FrontOrder {

    private int forestPatrolId;

    public FrontOrderPatrol(int forestPatrolId, Location location, boolean isGoToBase){
        super(location, isGoToBase);
        this.forestPatrolId = forestPatrolId;
    }


    public int getId(){
        return forestPatrolId;
    }

    @Override
    public String toString() {
        return "FrontOrderPatrol{" +
                "forestPatrolId=" + forestPatrolId +
                ", location=" + getLocation() +
                ", isGoToBase=" + isGoToBase() +
                '}';
    }
    
}
