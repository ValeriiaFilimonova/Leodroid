package systemctl;

import java.util.List;

class SystemctlException extends RuntimeException {
    private String output;
    private String message;

    private SystemctlException(SystemctlCommand command) {
        this.message = String.format("Error while executing command %s", command.toString());
    }

    SystemctlException(SystemctlCommand command, List<String> output) {
        this(command);
        this.output = output.stream()
                .reduce("", (result, current) -> String.format("%s\n%s", result, current));
    }

    SystemctlException(SystemctlCommand command, Throwable throwable) {
        this(command);
        initCause(throwable);
    }

    @Override public String getMessage() {
        return String.format("%s%s\n", message, output);
    }
}
