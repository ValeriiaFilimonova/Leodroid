import systemctl.Status;

class CommandExecutionResult {
    private String message;

    private CommandExecutionResult(String message) {
        this.message = message;
    }

    String getMessage() {
        return message;
    }

    static CommandExecutionResult from(Status serviceStatus, String applicationName) {
        switch (serviceStatus) {
            case NOT_FOUND:
                return new CommandExecutionResult(String.format("%s not installed", applicationName));
            case FAILED_TO_START:
                return new CommandExecutionResult(String.format("failed to start %s", applicationName));
            case FAILED_TO_STOP:
                return new CommandExecutionResult(String.format("failed to stop %s", applicationName));
            case ALREADY_STARTED:
                return new CommandExecutionResult(String.format("%s already started", applicationName));
            case NOT_RUNNING:
                return new CommandExecutionResult(String.format("%s in not running", applicationName));
            case SUCCESSFULLY_STARTED:
                return new CommandExecutionResult(String.format("%s successfully started", applicationName));
            case SUCCESSFULLY_STOPPED:
                return new CommandExecutionResult(String.format("%s successfully stopped", applicationName));
            default:
                return new CommandExecutionResult("Sorry, something went wrong");
        }
    }
}
