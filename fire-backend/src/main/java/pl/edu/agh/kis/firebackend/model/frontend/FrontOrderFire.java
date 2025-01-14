package pl.edu.agh.kis.firebackend.model.frontend;

import pl.edu.agh.kis.firebackend.model.primitives.Location;

public class FrontOrderFire extends FrontOrder{

        private int fireBrigadeId;

        public FrontOrderFire(int fireBrigadeId, Location location, boolean isGoToBase){
            super(location, isGoToBase);
            this.fireBrigadeId = fireBrigadeId;
        }
            
        @Override
        public int getId() {
            return fireBrigadeId;
        }
}
