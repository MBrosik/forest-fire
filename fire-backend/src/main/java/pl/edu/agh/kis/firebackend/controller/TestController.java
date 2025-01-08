package pl.edu.agh.kis.firebackend.controller;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import pl.edu.agh.kis.firebackend.model.FireBrigadeAction;
import pl.edu.agh.kis.firebackend.model.OrderFireBrigade;
import pl.edu.agh.kis.firebackend.model.events.EvFireBrigade;
import pl.edu.agh.kis.firebackend.model.primitives.Location;
import pl.edu.agh.kis.firebackend.model.test.ForesterDecision;
import pl.edu.agh.kis.firebackend.service.HttpRequestService;
import pl.edu.agh.kis.firebackend.service.SimulationStateService;
import pl.edu.agh.kis.firebackend.service.StateUpdatesService;

import java.util.Date;
import java.util.Map;

@RestController
@AllArgsConstructor
@RequestMapping("/test")
public class TestController {

    private StateUpdatesService stateUpdatesService;
    private HttpRequestService httpRequestService;

    @PostMapping("/sendData")
    public String sendData(@RequestBody Map<String, Object> data) {
        String url = "http://127.0.0.1:5000/run_simulation";
        return httpRequestService.sendPostRequest(url, data);
    }

    @GetMapping("/sendTestDataToMQ")
    public String sendToMQ() {
        // Utwórz obiekt OrderFireBrigade z bieżącym czasem
        OrderFireBrigade order = new OrderFireBrigade(
                456,
                FireBrigadeAction.GO_TO_BASE,
                new Date() // Bieżąca data
        );

        // Wyślij wiadomość do kolejki
        stateUpdatesService.sendMessageToQueue("Fire brigade", order)
                           .subscribe(); // Asynchroniczne wysłanie wiadomości

        return "Message sent!";
    }
}
