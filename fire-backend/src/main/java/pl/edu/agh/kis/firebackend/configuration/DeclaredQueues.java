package pl.edu.agh.kis.firebackend.configuration;

import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import pl.edu.agh.kis.firebackend.model.UpdatesQueue;
import pl.edu.agh.kis.firebackend.model.events.*;
import pl.edu.agh.kis.firebackend.model.ForesterPatrol;
import pl.edu.agh.kis.firebackend.model.OrderFireBrigade;
import pl.edu.agh.kis.firebackend.model.OrderForesterPatrol;
import pl.edu.agh.kis.firebackend.service.StateUpdatesService;
import reactor.core.publisher.Flux;

@Configuration
@AllArgsConstructor
public class DeclaredQueues {
    private final StateUpdatesService stateUpdatesService;

    @Bean
    Flux<EvFireBrigade> fireBrigadeUpdates() {
        return stateUpdatesService.createUpdatesFlux(new UpdatesQueue<>("Fire brigades state queue", EvFireBrigade.class));
    }

    @Bean
    Flux<ForesterPatrol> foresterPatrolUpdates() {
        return stateUpdatesService.createUpdatesFlux(new UpdatesQueue<>("Forester patrol state queue", ForesterPatrol.class));
    }

    @Bean
    Flux<EvWindSpeedSensor> windSpeedSensorUpdates() {
        return stateUpdatesService.createUpdatesFlux(new UpdatesQueue<>("Wind speed queue", EvWindSpeedSensor.class));
    }

    @Bean
    Flux<EvTempAndAirHumiditySensor> tempAndAirHumiditySensorUpdates() {
        return stateUpdatesService.createUpdatesFlux(new UpdatesQueue<>("Temp and air humidity queue", EvTempAndAirHumiditySensor.class));
    }

    @Bean
    Flux<EvWindDirectionSensor> windDirectionSensorUpdates() {
        return stateUpdatesService.createUpdatesFlux(new UpdatesQueue<>("Wind direction queue", EvWindDirectionSensor.class));
    }

    @Bean
    Flux<EvLitterMoistureSensor> litterMoistureSensorUpdates() {
        return stateUpdatesService.createUpdatesFlux(new UpdatesQueue<>("Litter moisture queue", EvLitterMoistureSensor.class));
    }

    @Bean
    Flux<EvCO2Sensor> co2SensorUpdates() {
        return stateUpdatesService.createUpdatesFlux(new UpdatesQueue<>("CO2 queue", EvCO2Sensor.class));
    }

    @Bean
    Flux<EvPM25ConcentrationSensor> pm25ConcentrationSensorUpdates() {
        return stateUpdatesService.createUpdatesFlux(new UpdatesQueue<>("PM2.5 queue", EvPM25ConcentrationSensor.class));
    }

    @Bean
    Flux<EvCamera> cameraUpdates() {
        return stateUpdatesService.createUpdatesFlux(new UpdatesQueue<>("Camera queue", EvCamera.class));
    }

}
