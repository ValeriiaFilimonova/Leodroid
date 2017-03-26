package systemctl;

class Service {
    private String serviceName;
    private boolean isEnabled = false;
    private boolean isActive = false;

    private boolean setEnabled(String serviceName) {
        return SystemctlExecutor.isServiceEnabled(serviceName);
    }

    private boolean setActive(String serviceName) {
        if (!isEnabled) {
            return false;
        }
        return SystemctlExecutor.isServiceActive(serviceName);
    }

    Service(String serviceName) {
        this.serviceName = serviceName;
        this.isEnabled = setEnabled(serviceName);
        this.isActive = setActive(serviceName);
    }

    boolean isActive() {
        return isActive;
    }

    void start() {
        if (!isEnabled) {
            SystemctlExecutor.enableService(serviceName);
        }
        if (!isActive) {
            SystemctlExecutor.startService(serviceName);
        }
    }

    void stop() {
        if (isActive) {
            SystemctlExecutor.stopService(serviceName);
        }
    }
}
