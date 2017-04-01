package storage;

public class DataStorageClientException extends RuntimeException {
    DataStorageClientException(Throwable throwable) {
        super(throwable);
    }

    @Override public String getMessage() {
        return getCause().getMessage();
    }
}
