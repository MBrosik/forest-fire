package pl.edu.agh.kis.firebackend.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import pl.edu.agh.kis.firebackend.model.simulation.SimulationState;

@Configuration
public class SimulationStateConfiguration {
    @Bean
    public SimulationState initialState() {
        return new SimulationState();
    }
}
