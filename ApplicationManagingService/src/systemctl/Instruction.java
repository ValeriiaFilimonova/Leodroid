package systemctl;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

class Instruction {
    private static String SUDO = "sudo";
    private static String SYSTEMCTL = "systemctl";

    private List<String> output;

    private Process startProcess(String command, String serviceName) throws IOException {
        ProcessBuilder processBuilder = new ProcessBuilder(SUDO, SYSTEMCTL, command, serviceName);
        processBuilder.redirectErrorStream(true);

        return processBuilder.start();
    }

    private List<String> readOutput(Process process) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        List<String> output = new ArrayList<>();
        String line;

        while ((line = reader.readLine()) != null) {
            output.add(line);
        }
        reader.close();

        return output;
    }

    private Instruction(SystemctlCommand command, String serviceName) {
        try {
            Process process = startProcess(command.toString(), serviceName);
            output = readOutput(process);

            process.waitFor();
        }
        catch (IOException | InterruptedException ex) {
            throw new SystemctlException(command, ex);
        }

    }

    List<String> getFullOutput() {
        return output;
    }

    String getOutputStart() {
        if (output.isEmpty()) {
            return "";
        }
        return output.get(0);
    }

    static Instruction execute(SystemctlCommand command, String serviceName) {
        return new Instruction(command, serviceName);
    }
}
