import systemctl.ServiceManager;

import java.util.function.Function;

public enum Command {
    START_APPLICATION("open the app", ServiceManager::startService),
    STOP_APPLICATION("close the app", ServiceManager::stopService);

    private String stringValue;
    private Function<String, ServiceManager.Status> instruction;

    public String getString() {
        return stringValue;
    }

    public CommandExecutionResult execute(String applicationName) {
        ServiceManager.Status managerStatus = instruction.apply(applicationName);
        return CommandExecutionResult.from(managerStatus, applicationName);
    }

    Command(String stringValue, Function<String, ServiceManager.Status> instruction) {
        this.stringValue = stringValue;
        this.instruction = instruction;
    }
}
