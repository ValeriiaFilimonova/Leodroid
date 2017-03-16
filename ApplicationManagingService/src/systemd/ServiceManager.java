package systemd;

// systemctl status

// systemctl is-active
// systemctl is-enabled

// systemctl enable
// systemctl disable
// systemctl start
// systemctl restart
// systemctl stop
public class ServiceManager {
    public enum Status {
        SUCCESS, FAILURE
    }

    public static Status startService(String name) {
        return Status.SUCCESS;
    }

    public static Status stopService(String name) {
        return Status.SUCCESS;
    }
}
