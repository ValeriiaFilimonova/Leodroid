package systemctl;

public enum Status {
    NOT_FOUND, ALREADY_STARTED, NOT_RUNNING,
    FAILED_TO_START("failed"), FAILED_TO_STOP("failed"),
    SUCCESSFULLY_STARTED("running"), SUCCESSFULLY_STOPPED("stopped");

    private String statusString;

    Status() {}

    Status(String statusString) {
        this.statusString = statusString;
    }

    @Override public String toString() {
        return statusString;
    }

    public static Status getStatusByString(String statusString) {
        for (Status status : Status.values()) {
            if (status.toString() != null && status.toString().equals(statusString)) {
                return status;
            }
        }

        return null;
    }
}
