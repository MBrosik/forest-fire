package pl.edu.agh.kis.firebackend.model.test;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import pl.edu.agh.kis.firebackend.model.primitives.Location;

@AllArgsConstructor
@Getter
public class ForesterDecision {
    @JsonProperty
    private int foresterPatrolId;

    @JsonProperty
    private Location location;
}
