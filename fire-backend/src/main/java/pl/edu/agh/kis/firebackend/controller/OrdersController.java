package pl.edu.agh.kis.firebackend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;
import pl.edu.agh.kis.firebackend.model.frontend.FrontOrderFire;
import pl.edu.agh.kis.firebackend.service.OrdersService;

@RestController
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class OrdersController {
    private OrdersService ordersService;

    @PostMapping("/orderFireBrigade")
    public ResponseEntity<String> sentOrderBrigade(@RequestBody FrontOrderFire order){
        ordersService.processOrder(order);
        return ResponseEntity.ok("Order received!");
    }

    @PostMapping("/orderForestPatrol")
    public ResponseEntity<String> sentOrderPatrol(@RequestBody FrontOrderFire order){
        ordersService.processOrder(order);
        return ResponseEntity.ok("Order received!");
    }

    

}