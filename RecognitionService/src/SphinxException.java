public class SphinxException extends RuntimeException {
    public SphinxException(Throwable cause) {
        super(cause);
    }

    @Override public String getMessage() {
        return this.getCause().getMessage();
    }
}
