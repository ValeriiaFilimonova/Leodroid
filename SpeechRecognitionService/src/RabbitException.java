public class RabbitException extends RuntimeException {
    public RabbitException(Errors error, Throwable reason) {
        super(error.getMessage(), reason);
    }

    @Override public String getMessage() {
        return String.format("%s: %s", this.getMessage(), this.getCause().getMessage());
    }

    enum Errors {
        CONNECTION_ERROR("establishing connection"),
        CHANNEL_ERROR("creating channel"),
        SEND_MESSAGE_ERROR("sending message");

        private String message;

        Errors(String message) {
            this.message = message;
        }

        public String getMessage() {
            return "Error while " + message;
        }
    }
}
