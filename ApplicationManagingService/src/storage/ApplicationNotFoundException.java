package storage;

public class ApplicationNotFoundException extends RuntimeException {
    ApplicationNotFoundException(String applicationName) {
        super(String.format("Application %s doesn't exist", applicationName));
    }
}
