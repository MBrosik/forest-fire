package pl.edu.agh.kis.firebackend.service;

import java.util.Date;

import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import pl.edu.agh.kis.firebackend.model.FireBrigadeAction;
import pl.edu.agh.kis.firebackend.model.ForesterPatrolAction;
import pl.edu.agh.kis.firebackend.model.OrderFireBrigade;
import pl.edu.agh.kis.firebackend.model.OrderForesterPatrol;
import pl.edu.agh.kis.firebackend.model.frontend.FrontOrder;
import pl.edu.agh.kis.firebackend.model.frontend.FrontOrderFire;
import pl.edu.agh.kis.firebackend.model.frontend.FrontOrderPatrol;

@Service
@AllArgsConstructor
public class OrdersService {

    private StateUpdatesService stateUpdatesService;

    public void processOrder(FrontOrder order){
        System.out.println("proccess order");
        if(order instanceof FrontOrderFire){
            System.out.println("front order fire");
            OrderFireBrigade orderFireBrigade;
            if(order.isGoToBase()){
                orderFireBrigade = new OrderFireBrigade(order.getId(), FireBrigadeAction.GO_TO_BASE, null, new Date(), order.getLocation());
            } else {
                orderFireBrigade = new OrderFireBrigade(order.getId(), FireBrigadeAction.EXTINGUISH, null, new Date(), order.getLocation());
            }
            stateUpdatesService.sendMessageToQueue("Fire brigades action queue", orderFireBrigade)
                .subscribe(
                    result -> System.out.println("Successfully sent message heehehe"),
                    error -> System.out.println("Failed to send message heehehe")
                );
            System.out.println("Order mapped to: " + orderFireBrigade.toString() + " and sended to simulation.");

        } else if(order instanceof FrontOrderPatrol){
            OrderForesterPatrol orderForestPatrol;
            if(order.isGoToBase()){
                orderForestPatrol = new OrderForesterPatrol(order.getId(), ForesterPatrolAction.GO_TO_BASE, new Date(), order.getLocation());
            } else {
                orderForestPatrol = new OrderForesterPatrol(order.getId(), ForesterPatrolAction.PATROL, new Date(), order.getLocation()); 
            }
            stateUpdatesService.sendMessageToQueue("Forester patrol action queue", orderForestPatrol)
                .subscribe(
                    result -> System.out.println("Successfully sent message heehehe"),
                    error -> System.out.println("Failed to send message heehehe")
                );
            System.out.println("Order mapped to: " + orderForestPatrol.toString() + " and sended to simulation.");
        }
        

    }
}
