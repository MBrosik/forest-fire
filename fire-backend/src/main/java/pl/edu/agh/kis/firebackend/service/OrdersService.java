package pl.edu.agh.kis.firebackend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import lombok.AllArgsConstructor;
import pl.edu.agh.kis.firebackend.model.OrderFireBrigade;
import pl.edu.agh.kis.firebackend.model.frontend.FrontOrder;
import pl.edu.agh.kis.firebackend.model.frontend.FrontOrderFire;
import pl.edu.agh.kis.firebackend.model.frontend.FrontOrderPatrol;
import pl.edu.agh.kis.firebackend.model.FireBrigadeAction;
import pl.edu.agh.kis.firebackend.model.ForesterPatrolAction;
import pl.edu.agh.kis.firebackend.model.OrderForesterPatrol;
import java.util.Date;

@Service
@AllArgsConstructor
public class OrdersService {

    private StateUpdatesService stateUpdatesService;

    public void processOrder(FrontOrder order){

        if(order instanceof FrontOrderFire){
            OrderFireBrigade orderFireBrigade;
            if(order.isGoToBase()){
                orderFireBrigade = new OrderFireBrigade(order.getId(), FireBrigadeAction.GO_TO_BASE, null, new Date(), order.getLocation());
            } else {
                orderFireBrigade = new OrderFireBrigade(order.getId(), FireBrigadeAction.EXTINGUISH, null, new Date(), order.getLocation());
            }
            stateUpdatesService.sendMessageToQueue("Fire brigades action queue", orderFireBrigade);

        } else if(order instanceof FrontOrderPatrol){
            OrderForesterPatrol orderForestPatrol;
            if(order.isGoToBase()){
                orderForestPatrol = new OrderForesterPatrol(order.getId(), ForesterPatrolAction.GO_TO_BASE, new Date(), order.getLocation());
            } else {
                orderForestPatrol = new OrderForesterPatrol(order.getId(), ForesterPatrolAction.PATROL, new Date(), order.getLocation()); 
            }
            stateUpdatesService.sendMessageToQueue("Forester patrols action queue", orderForestPatrol);
        }

    }
}
