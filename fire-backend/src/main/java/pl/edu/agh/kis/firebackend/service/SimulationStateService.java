package pl.edu.agh.kis.firebackend.service;

import java.time.Duration;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import pl.edu.agh.kis.firebackend.model.configuration.Configuration;
import pl.edu.agh.kis.firebackend.model.events.EvCO2Sensor;
import pl.edu.agh.kis.firebackend.model.events.EvCamera;
import pl.edu.agh.kis.firebackend.model.events.EvFireBrigade;
import pl.edu.agh.kis.firebackend.model.events.EvForestPatrol;
import pl.edu.agh.kis.firebackend.model.events.EvLitterMoistureSensor;
import pl.edu.agh.kis.firebackend.model.events.EvPM25ConcentrationSensor;
import pl.edu.agh.kis.firebackend.model.events.EvTempAndAirHumiditySensor;
import pl.edu.agh.kis.firebackend.model.events.EvWindDirectionSensor;
import pl.edu.agh.kis.firebackend.model.events.EvWindSpeedSensor;
import pl.edu.agh.kis.firebackend.model.simulation.FireBrigade;
import pl.edu.agh.kis.firebackend.model.simulation.ForesterPatrol;
import pl.edu.agh.kis.firebackend.model.simulation.SimulationState;
import pl.edu.agh.kis.firebackend.model.simulation.SimulationStateDto;
import pl.edu.agh.kis.firebackend.util.SectorIdResolver;
import reactor.core.publisher.Flux;
import reactor.core.scheduler.Schedulers;

@Service
@AllArgsConstructor
public class SimulationStateService {
    private Flux<EvFireBrigade> fireBrigadeFlux;
    private Flux<EvForestPatrol> foresterPatrolFlux;
    private Flux<EvWindSpeedSensor> windSpeedSensorFlux;
    private Flux<EvTempAndAirHumiditySensor> tempAndAirHumiditySensorFlux;
    private Flux<EvWindDirectionSensor> windDirectionSensorFlux;
    private Flux<EvLitterMoistureSensor> litterMoistureSensorFlux;
    private Flux<EvCO2Sensor> co2SensorFlux;
    private Flux<EvPM25ConcentrationSensor> pm25ConcentrationSensorFlux;
    private Flux<EvCamera> cameraFlux;

    private static final Logger log = LoggerFactory.getLogger(SimulationStateService.class);

    public Flux<SimulationStateDto> runSimulation(Configuration configuration, Duration interval) {
        SimulationState state = SimulationState.from(configuration);

        fireBrigadeFlux.subscribeOn(Schedulers.parallel())            
            .subscribe(fireBrigade -> {
                Integer key = fireBrigade.fireBrigadeId();                
                System.out.println("-----------------aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-----------------");
                System.out.println("-----------------aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-----------------");
                System.out.println("-----------------aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-----------------");
                System.out.println("-----------------aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-----------------");
                System.out.println("Fire brigade id: " + key);
                System.out.println("Fire brigade: " + fireBrigade);
                synchronized (state) {
                    state.fireBrigades.put(key, FireBrigade.from(fireBrigade));
                }
        });

        foresterPatrolFlux.subscribeOn(Schedulers.parallel())
            .subscribe(foresterPatrol -> {
                Integer key = foresterPatrol.foresterPatrolId();
                System.out.println("-----------------bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb-----------------");
                System.out.println("-----------------bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb-----------------");
                System.out.println("-----------------bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb-----------------");
                System.out.println("-----------------bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb-----------------");
                System.out.println("Forester patrol id: " + key);
                System.out.println("Forester patrol: " + foresterPatrol);

                synchronized (state) {
                    state.foresterPatrols.put(key, ForesterPatrol.from(foresterPatrol));
                }
        });

        windSpeedSensorFlux.subscribeOn(Schedulers.parallel())
            .subscribe(windSpeedSensor -> {
                Optional<Integer> sectorIdOptional = SectorIdResolver.resolveSectorId(state.sectors.values().stream().toList(), windSpeedSensor.location());
                if (sectorIdOptional.isEmpty()) {
                    log.warn("Sector at location {} not found!", windSpeedSensor.location());
                    return;
                }
                Integer sectorId = sectorIdOptional.get();
                synchronized (state) {
                    state.sectors.get(sectorId).state.windSpeed = windSpeedSensor.data().windSpeed();
                }
        });

        tempAndAirHumiditySensorFlux.subscribeOn(Schedulers.parallel())
            .subscribe(tempAndAirHumiditySensor -> {
                Optional<Integer> sectorIdOptional = SectorIdResolver.resolveSectorId(state.sectors.values().stream().toList(), tempAndAirHumiditySensor.location());
                if (sectorIdOptional.isEmpty()) {
                    log.warn("Sector at location {} not found!", tempAndAirHumiditySensor.location());
                    return;
                }
                Integer sectorId = sectorIdOptional.get();
                synchronized (state) {
                    state.sectors.get(sectorId).state.temperature = tempAndAirHumiditySensor.data().temperature();
                    state.sectors.get(sectorId).state.airHumidity = tempAndAirHumiditySensor.data().airHumidity();
                    System.out.println("----------------------cccccccccccccccccccccccccccccccccccc----------------------");
                    System.out.println("Sector id: " + sectorId);
                    System.out.println("Temperature: " + tempAndAirHumiditySensor.data().temperature());
                }
        });

        windDirectionSensorFlux.subscribeOn(Schedulers.parallel())
            .subscribe(windDirectionSensor -> {
                Optional<Integer> sectorIdOptional = SectorIdResolver.resolveSectorId(state.sectors.values().stream().toList(), windDirectionSensor.location());
                if (sectorIdOptional.isEmpty()) {
                    log.warn("Sector at location {} not found!", windDirectionSensor.location());
                    return;
                }
                Integer sectorId = sectorIdOptional.get();
                synchronized (state) {
                    state.sectors.get(sectorId).state.windDirection = windDirectionSensor.data().windDirection();
                }
        });

        litterMoistureSensorFlux.subscribeOn(Schedulers.parallel())
            .subscribe(litterMoistureSensor -> {
                Optional<Integer> sectorIdOptional = SectorIdResolver.resolveSectorId(state.sectors.values().stream().toList(), litterMoistureSensor.location());
                if (sectorIdOptional.isEmpty()) {
                    log.warn("Sector at location {} not found!", litterMoistureSensor.location());
                    return;
                }
                Integer sectorId = sectorIdOptional.get();
                synchronized (state) {
                    state.sectors.get(sectorId).state.plantLitterMoisture = litterMoistureSensor.data().litterMoisture();
                }
        });

        co2SensorFlux.subscribeOn(Schedulers.parallel())
                .subscribe(co2Sensor -> {
                    Optional<Integer> sectorIdOptional = SectorIdResolver.resolveSectorId(state.sectors.values().stream().toList(), co2Sensor.location());
                    if (sectorIdOptional.isEmpty()) {
                        log.warn("Sector at location {} not found!", co2Sensor.location());
                        return;
                    }
                    Integer sectorId = sectorIdOptional.get();
                    synchronized (state) {
                        state.sectors.get(sectorId).state.co2Concentration = co2Sensor.data().co2Concentration();
                    }
        });

        pm25ConcentrationSensorFlux.subscribeOn(Schedulers.parallel())
                .subscribe(pm25ConcentrationSensor -> {
                    Optional<Integer> sectorIdOptional = SectorIdResolver.resolveSectorId(state.sectors.values().stream().toList(), pm25ConcentrationSensor.location());
                    if (sectorIdOptional.isEmpty()) {
                        log.warn("Sector at location {} not found!", pm25ConcentrationSensor.location());
                        return;
                    }
                    Integer sectorId = sectorIdOptional.get();
                    synchronized (state) {
                        state.sectors.get(sectorId).state.pm2_5Concentration = pm25ConcentrationSensor.data().pm2_5Concentration();
                    }
        });

        cameraFlux.subscribeOn(Schedulers.parallel())
                .subscribe(camera -> {
                    Optional<Integer> sectorIdOptional = SectorIdResolver.resolveSectorId(state.sectors.values().stream().toList(), camera.location());
                    if (sectorIdOptional.isEmpty()) {
                        log.warn("Sector at location {} not found!", camera.location());
                        return;
                    }
                    Integer sectorId = sectorIdOptional.get();
                    synchronized (state) {
                        // TODO: Handle it in some way
                    }
        });

        return Flux.interval(interval)
            .map(tick -> {
                synchronized(state) {
                    return SimulationStateDto.from(state);
                }
            });
    }
}
