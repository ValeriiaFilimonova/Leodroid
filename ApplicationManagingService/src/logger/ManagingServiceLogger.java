package logger;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;

public class ManagingServiceLogger {
    private static HashMap<Class, ManagingServiceLogger> loggers = new HashMap<>();

    static {
        System.setProperty("org.slf4j.simpleLogger.showDateTime", "true");
        System.setProperty("org.slf4j.simpleLogger.dateTimeFormat", "yyyy-MM-dd' 'HH:mm:ss");
        System.setProperty("org.slf4j.simpleLogger.showThreadName", "false");
    }

    public static ManagingServiceLogger getInstance(Class clazz) {
        loggers.putIfAbsent(clazz, new ManagingServiceLogger(clazz));
        return loggers.get(clazz);
    }

    private Logger logger;

    private ManagingServiceLogger(Class clazz) {
        logger = LoggerFactory.getLogger(clazz);
    }

    public void logIncomingMessage(String message) {
        logger.info("Incoming message: " + message);
    }

    public void logOutcomingMessage(String message) {
        logger.info("Oucoming message: " + message);
    }

    public void logRuntimeException(Exception ex) {
        logger.error("Runtime managing exception", ex);
    }
}
