package pl.edu.agh.kis.firebackend.configuration;

import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import pl.edu.agh.kis.firebackend.model.UpdatesQueue;
import pl.edu.agh.kis.firebackend.model.events.*;
import pl.edu.agh.kis.firebackend.model.ForesterPatrol;
import pl.edu.agh.kis.firebackend.service.StateUpdatesService;
import reactor.core.publisher.Flux;

@Configuration
@AllArgsConstructor
public class DeclaredQueues {
    private final StateUpdatesService stateUpdatesService;

    @Bean
    Flux<EvFireBrigade> fireBrigadeUpdates() {
        return stateUpdatesService.createUpdatesFlux(new UpdatesQueue<>("fireBrigade", EvFireBrigade.class));
    }

    @Bean
    Flux<ForesterPatrol> foresterPatrolUpdates() {
        return stateUpdatesService.createUpdatesFlux(new UpdatesQueue<>("foresterPatrol", ForesterPatrol.class));
    }

    @Bean
    Flux<EvWindSpeedSensor> windSpeedSensorUpdates() {
        return stateUpdatesService.createUpdatesFlux(new UpdatesQueue<>("windSpeed", EvWindSpeedSensor.class));
    }

    @Bean
    Flux<EvTempAndAirHumiditySensor> tempAndAirHumiditySensorUpdates() {
        return stateUpdatesService.createUpdatesFlux(new UpdatesQueue<>("tempAndAirHumidity", EvTempAndAirHumiditySensor.class));
    }

    @Bean
    Flux<EvWindDirectionSensor> windDirectionSensorUpdates() {
        return stateUpdatesService.createUpdatesFlux(new UpdatesQueue<>("windDirection", EvWindDirectionSensor.class));
    }

    @Bean
    Flux<EvLitterMoistureSensor> litterMoistureSensorUpdates() {
        return stateUpdatesService.createUpdatesFlux(new UpdatesQueue<>("litterMoisture", EvLitterMoistureSensor.class));
    }

    @Bean
    Flux<EvCO2Sensor> co2SensorUpdates() {
        return stateUpdatesService.createUpdatesFlux(new UpdatesQueue<>("co2", EvCO2Sensor.class));
    }

    @Bean
    Flux<EvPM25ConcentrationSensor> pm25ConcentrationSensorUpdates() {
        return stateUpdatesService.createUpdatesFlux(new UpdatesQueue<>("pm25", EvPM25ConcentrationSensor.class));
    }

    @Bean
    Flux<EvCamera> cameraUpdates() {
        return stateUpdatesService.createUpdatesFlux(new UpdatesQueue<>("camera", EvCamera.class));
    }
}
