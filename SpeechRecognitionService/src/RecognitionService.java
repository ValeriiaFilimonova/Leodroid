import droid.api.Droid;
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
        private Droid droid;

        private TerminationSignalHandler(LiveSpeechRecognizer recognizer, Droid droid) {
            this.recognizer = recognizer;
            this.droid = droid;
        }

        @Override public void handle(Signal signal) {
            try {
                if (droid != null) {
                    droid.destroy();
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

        public static void registerHandlers(LiveSpeechRecognizer recognizer, Droid droid) {
            TerminationSignalHandler handler = new TerminationSignalHandler(recognizer, droid);
            Signal.handle(new Signal("TERM"), handler);
            Signal.handle(new Signal("ABRT"), handler);
            Signal.handle(new Signal("INT"), handler);
        }
    }

    private static String UNKNOWN_TOKEN = "<unk>";

    public static void main(String[] args) {
        try {
            Configuration configuration = SphinxConfigurationFactory.getConfiguration();

            Droid droid = Droid.getInstance();
            LiveSpeechRecognizer recognizer = new LiveSpeechRecognizer(configuration);
            TerminationSignalHandler.registerHandlers(recognizer, droid);

            recognizer.startRecognition(false);

            while (true) {
                SpeechResult result = recognizer.getResult();
                String message = result.getHypothesis();

                if (!message.equals(UNKNOWN_TOKEN)) {
                    droid.putCommand(message);
                    logger.info("Outcoming message: " + message);
                }
            }
        }
        catch (IOException ex) {
            logger.error("Service error", ex);
            throw new SphinxException(ex);
        }
    }
}
