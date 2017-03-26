package systemctl;

import java.util.Arrays;

public class ServiceManager {
    public enum Status {
        NOT_FOUND,
        FAILED_TO_START, FAILED_TO_STOP,
        ALREADY_STARTED, NOT_RUNNING,
        SUCCESSFULLY_STARTED, SUCCESSFULLY_STOPPED
    }

    private static String getServiceName(String appName) {
        // TODO get service name from data storage to prevent unexpected running and stopping of built-in services
        return Arrays.stream(appName.split(" "))
                .reduce((result, current) -> String.format("%s-%s", result, current.toLowerCase()))
                .orElse(appName);
    }

    public static Status startService(String name) {
        try {
            String serviceName = getServiceName(name);
            Service service = new Service(serviceName);

            if (service.isActive()) {
                return Status.ALREADY_STARTED;
            }

            service.start();
            // TODO update service state through data storage
            return Status.SUCCESSFULLY_STARTED;
        }
        catch (ServiceNotFoundException ex) {
            return Status.NOT_FOUND;
        }
        // TODO send logs on failures at least
        catch (SystemctlException ex) {
            return Status.FAILED_TO_START;
        }
    }

    public static Status stopService(String name) {
        try {
            String serviceName = getServiceName(name);
            Service service = new Service(serviceName);

            if (!service.isActive()) {
                return Status.NOT_RUNNING;
            }

            service.stop();
            return Status.SUCCESSFULLY_STOPPED;
        }
        catch (ServiceNotFoundException ex) {
            return Status.NOT_FOUND;
        }
        catch (SystemctlException ex) {
            return Status.FAILED_TO_STOP;
        }
    }

}
