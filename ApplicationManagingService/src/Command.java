import systemctl.ServiceManager;
import systemctl.Status;

import java.util.function.Function;

public enum Command {
    START_APPLICATION("open the app", ServiceManager.getInstance()::startService),
    STOP_APPLICATION("close the app", ServiceManager.getInstance()::stopService);

    private String stringValue;
    private Function<String, Status> instruction;

    public String getString() {
        return stringValue;
    }

    public CommandExecutionResult execute(String applicationName) {
        Status managerStatus = instruction.apply(applicationName);
        return CommandExecutionResult.from(managerStatus, applicationName);
    }

    Command(String stringValue, Function<String, Status> instruction) {
        this.stringValue = stringValue;
        this.instruction = instruction;
    }
}
