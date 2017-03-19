package systemctl;

class ServiceNotFoundException extends RuntimeException {
    ServiceNotFoundException(String serviceName) {
        super(String.format("Service %s doesn't exist", serviceName));
    }
}
