package pl.edu.agh.kis.firebackend.model.frontend;

import lombok.AllArgsConstructor;
import pl.edu.agh.kis.firebackend.model.primitives.Location;;

@AllArgsConstructor
public abstract class FrontOrder {

    private Location location;
    private boolean isGoToBase;
    
    public abstract int getId();

    public Location getLocation(){
        return location;
    };

    public boolean isGoToBase(){
        return isGoToBase;
    };
}
