import edu.cmu.sphinx.api.Configuration;
import edu.cmu.sphinx.api.LiveSpeechRecognizer;
import edu.cmu.sphinx.api.SpeechResult;
import sun.misc.Signal;
import sun.misc.SignalHandler;

import java.io.IOException;

public class RecognitionService {
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
            }
            finally {
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
            }
        }
        catch (IOException ex) {
            throw new SphinxException(ex);
        }
    }
}
