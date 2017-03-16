import systemd.ServiceManager;

import java.util.function.Function;

public enum Command {
    START_APPLICATION("open the app", ServiceManager::startService, "successfully started", "failed to start"),
    STOP_APPLICATION("close the app", ServiceManager::stopService, "successfully stopped", "failed to stop");

    private String stringValue;
    private Function<String, ServiceManager.Status> instruction;
    private String successMessage;
    private String failureMessage;

    public String getString() {
        return stringValue;
    }

    public String getSuccessMessage(String applicationName) {
        return String.format("%s %s", applicationName, successMessage);
    }

    public String getFailureMessage(String applicationName) {
        return String.format("%s %s", failureMessage, applicationName);
    }

    public ServiceManager.Status execute(String applicationName) {
        return instruction.apply(applicationName);
    }

    Command(String stringValue, Function<String, ServiceManager.Status> instruction, String successMessage, String failureMessage) {
        this.stringValue = stringValue;
        this.instruction = instruction;
        this.successMessage = successMessage;
        this.failureMessage = failureMessage;
    }
}
