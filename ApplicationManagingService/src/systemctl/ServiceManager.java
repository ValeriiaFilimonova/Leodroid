package systemctl;

import logger.ManagingServiceLogger;
import storage.ApplicationNotFoundException;
import storage.DataStorageClient;
import storage.DataStorageClientException;

public class ServiceManager {
    public enum Status {
        NOT_FOUND, ALREADY_STARTED, NOT_RUNNING,
        FAILED_TO_START("failed"), FAILED_TO_STOP("failed"),
        SUCCESSFULLY_STARTED("running"), SUCCESSFULLY_STOPPED("stopped");

        private String statusString;

        Status() {}

        Status(String statusString) {
            this.statusString = statusString;
        }


        @Override public String toString() {
            return statusString;
        }
    }

    private static ServiceManager managerInstance;

    public static ServiceManager getInstance() {
        if (managerInstance == null) {
            managerInstance = new ServiceManager();
        }
        return managerInstance;
    }

    private DataStorageClient dataStorageClient;
    private ManagingServiceLogger logger = ManagingServiceLogger.getInstance(ServiceManager.class);

    private ServiceManager() {
        dataStorageClient = new DataStorageClient();
    }

    private String getServiceName(String appName) {
        return dataStorageClient.getServiceName(appName);
    }

    private Status updateServiceStatus(String serviceName, Status status) {
        dataStorageClient.updateServiceStatus(serviceName, status.toString());
        return status;
    }

    public Status startService(String name) {
        try {
            String serviceName = getServiceName(name);

            try {
                Service service = new Service(serviceName);

                if (service.isActive()) {
                    return Status.ALREADY_STARTED;
                }

                service.start();
                return updateServiceStatus(serviceName, Status.SUCCESSFULLY_STARTED);
            }
            catch (ServiceNotFoundException ex) {
                logger.logRuntimeException(ex);
                return Status.NOT_FOUND;
            }
            catch (SystemctlException | DataStorageClientException ex) {
                logger.logRuntimeException(ex);
                return updateServiceStatus(serviceName, Status.FAILED_TO_START);
            }
        }
        catch (ApplicationNotFoundException ex) {
            logger.logRuntimeException(ex);
            return Status.NOT_FOUND;
        }
    }

    public Status stopService(String name) {
        try {
            String serviceName = getServiceName(name);

            try {
                Service service = new Service(serviceName);

                if (!service.isActive()) {
                    return Status.NOT_RUNNING;
                }

                service.stop();
                return updateServiceStatus(serviceName, Status.SUCCESSFULLY_STOPPED);
            }
            catch (ServiceNotFoundException ex) {
                logger.logRuntimeException(ex);
                return Status.NOT_FOUND;
            }
            catch (SystemctlException | DataStorageClientException ex) {
                logger.logRuntimeException(ex);
                return updateServiceStatus(serviceName, Status.FAILED_TO_STOP);
            }
        }
        catch (ApplicationNotFoundException ex) {
            logger.logRuntimeException(ex);
            return Status.NOT_FOUND;
        }
    }
}
