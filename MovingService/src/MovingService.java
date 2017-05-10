import droid.api.Droid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import sun.misc.Signal;
import sun.misc.SignalHandler;

public class MovingService implements SignalHandler {
    private Platform platform = new Platform();
    private Droid droid = Droid.getInstance();
    private Logger logger = LoggerFactory.getLogger(MovingService.class);

    private void start() {
        logger.info("Service started");
        droid.listen((message) -> {
            try {
                switch (message) {
                    case "move": {
                        platform.move();
                        logger.info(String.format("Got message: %s", message));
                        break;
                    }
                    case "change direction": {
                        platform.changeDirection();
                        logger.info(String.format("Got message: %s", message));
                        break;
                    }
                    case "stop": {
                        platform.stop();
                        logger.info(String.format("Got message: %s", message));
                        break;
                    }
                }
            }
            catch (InterruptedException ex) {
                logger.error("Failed to stop thread", ex);
            }
        });
    }

    @Override public void handle(Signal signal) {
        droid.destroy();
        logger.info("Service stopped");
    }

    public static void main(String[] args) throws InterruptedException {
        MovingService movingService = new MovingService();

        Signal.handle(new Signal("TERM"), movingService);
        Signal.handle(new Signal("ABRT"), movingService);
        Signal.handle(new Signal("INT"), movingService);

        movingService.start();
    }
}
