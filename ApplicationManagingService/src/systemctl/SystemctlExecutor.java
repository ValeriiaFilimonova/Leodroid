package systemctl;

class SystemctlExecutor {
    private static String NO_SUCH_FILE = "No such file or directory";
    private static String SYMLINK_CREATED = "Created symlink";

    static boolean isServiceEnabled(String serviceName) {
        SystemctlCommand command = SystemctlCommand.IS_ENABLED;

        Instruction instruction = Instruction.execute(command, serviceName);
        String result = instruction.getOutputStart();

        if ("enabled".equals(result)) {
            return true;
        }
        if ("static".equals(result)) {
            return true;
        }
        if ("disabled".equals(result)) {
            return false;
        }
        // TODO modify this check
        if (result.contains(NO_SUCH_FILE)) {
            throw new ServiceNotFoundException(serviceName);
        }
        throw new SystemctlException(command, instruction.getFullOutput());
    }

    static void enableService(String serviceName) {
        SystemctlCommand command = SystemctlCommand.ENABLE;

        Instruction instruction = Instruction.execute(command, serviceName);

        if (instruction.getFullOutput().isEmpty()) {
            return;
        }
        if (instruction.getOutputStart().startsWith(SYMLINK_CREATED)) {
            return;
        }
        throw new SystemctlException(command, instruction.getFullOutput());
    }

    static boolean isServiceActive(String serviceName) {
        SystemctlCommand command = SystemctlCommand.IS_ACTIVE;

        Instruction instruction = Instruction.execute(command, serviceName);
        String result = instruction.getOutputStart();

        if ("active".equals(result)) {
            return true;
        }
        if ("inactive".equals(result)) {
            return false;
        }
        if ("failed".equals(result)) {
            return false;
        }
        throw new SystemctlException(command, instruction.getFullOutput());
    }

    static void startService(String serviceName) {
        SystemctlCommand command = SystemctlCommand.START;

        Instruction instruction = Instruction.execute(command, serviceName);

        if (instruction.getFullOutput().isEmpty()) {
            return;
        }
        throw new SystemctlException(command, instruction.getFullOutput());
    }

    static void stopService(String serviceName) {
        SystemctlCommand command = SystemctlCommand.STOP;

        Instruction instruction = Instruction.execute(command, serviceName);

        if (instruction.getFullOutput().isEmpty()) {
            return;
        }
        throw new SystemctlException(command, instruction.getFullOutput());
    }
}
