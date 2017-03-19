package systemctl;

public enum SystemctlCommand {
    STATUS("status"),

    IS_ACTIVE("is-active"),
    IS_ENABLED("is-enabled"),

    ENABLE("enable"),
    DISABLE("disable"),
    START("start"),
    STOP("stop");

    private String string;
    SystemctlCommand(String string) {
        this.string = string;
    }

    @Override public String toString() {
        return this.string;
    }
}
