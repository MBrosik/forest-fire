package pl.edu.agh.kis.firebackend.model;

public record UpdatesQueue<T>(
    String name,
    Class<T> eventClass
) {
}
