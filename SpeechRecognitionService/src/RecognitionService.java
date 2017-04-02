import edu.cmu.sphinx.api.Configuration;
import edu.cmu.sphinx.api.LiveSpeechRecognizer;
import edu.cmu.sphinx.api.SpeechResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import sun.misc.Signal;
import sun.misc.SignalHandler;

import java.io.IOException;

public class RecognitionService {
    static {
        System.setProperty("org.slf4j.simpleLogger.showDateTime", "true");
        System.setProperty("org.slf4j.simpleLogger.dateTimeFormat", "HH:mm:ss.SSS");
        System.setProperty("org.slf4j.simpleLogger.showThreadName", "false");
    }

    private static Logger logger = LoggerFactory.getLogger(RecognitionService.class);

    private static class TerminationSignalHandler implements SignalHandler {
        private LiveSpeechRecognizer recognizer;
        private MessageBus bus;

        private TerminationSignalHandler(LiveSpeechRecognizer recognizer, MessageBus bus) {
            this.recognizer = recognizer;
            this.bus = bus;
        }

        @Override public void handle(Signal signal) {
            try {
                if (bus != null) {
                    bus.closeConnection();
                }

                if (recognizer != null) {
                    recognizer.stopRecognition();
                }
            }
            catch (IllegalStateException ex) {
                logger.error("Service error", ex);
            }
            finally {
                logger.info("Service stopped");
                System.exit(0);
            }
        }

        public static void registerHandlers(LiveSpeechRecognizer recognizer, MessageBus bus) {
            TerminationSignalHandler handler = new TerminationSignalHandler(recognizer, bus);
            Signal.handle(new Signal("TERM"), handler);
            Signal.handle(new Signal("ABRT"), handler);
            Signal.handle(new Signal("INT"), handler);
        }
    }

    public static void main(String[] args) {
        try {
            Configuration configuration = SphinxConfigurationFactory.getConfiguration();

            MessageBus messageBus = new MessageBus();
            LiveSpeechRecognizer recognizer = new LiveSpeechRecognizer(configuration);
            TerminationSignalHandler.registerHandlers(recognizer, messageBus);

            recognizer.startRecognition(false);

            while (true) {
                SpeechResult result = recognizer.getResult();
                String message = result.getHypothesis();
                messageBus.sendMessage(message);
                logger.info("Outcoming message: " + message);
            }
        }
        catch (IOException ex) {
            logger.error("Service error", ex);
            throw new SphinxException(ex);
        }
    }
}
