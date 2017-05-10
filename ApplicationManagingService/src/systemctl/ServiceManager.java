package systemctl;

import com.google.common.util.concurrent.UncheckedExecutionException;
import logger.ManagingServiceLogger;
import storage.ApplicationNotFoundException;
import storage.DataStorageClient;
import storage.DataStorageClientException;

import java.util.Map;

public class ServiceManager {
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

    private Status getAndUpdateServiceStatus(String name) {
        try {
            Thread.sleep(1000);
            Map<String, String> statuses = dataStorageClient.getServiceStatuses();
            String statusString = statuses.get(name);

            return Status.getStatusByString(statusString);
        }
        catch (InterruptedException ex) {
            logger.logRuntimeException(ex);
            throw new UncheckedExecutionException(ex);
        }
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
                return getAndUpdateServiceStatus(serviceName);
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
                return getAndUpdateServiceStatus(serviceName);
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
