package pl.edu.agh.kis.firebackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.edu.agh.kis.firebackend.service.HttpRequestService;

import java.util.Map;

@RestController
public class TestController {

    @Autowired
    private HttpRequestService myService;

    @PostMapping("/sendData")
    public String sendData(@RequestBody Map<String, Object> data) {
        String url = "http://127.0.0.1:5000/run_simulation";
        return myService.sendPostRequest(url, data);
    }
}
