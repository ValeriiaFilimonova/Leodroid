package message.bus;

public class RabbitException extends RuntimeException {
    RabbitException(Errors error, Throwable reason) {
        super(error.getMessage(), reason);
    }

    @Override public String getMessage() {
        return String.format("%s: %s", super.getMessage(), this.getCause().getMessage());
    }

    enum Errors {
        CONNECTION_ERROR("establishing connection"),
        CHANNEL_ERROR("creating channel"),
        QUEUE_ERROR("getting queue"),
        SET_CONSUMER_ERROR("setting consumer"),
        SEND_MESSAGE_ERROR("sending message"),
        CLOSE_CONNECTION_ERROR("closing connection");

        private String message;

        Errors(String message) {
            this.message = message;
        }

        public String getMessage() {
            return "Error while " + message;
        }
    }
}
