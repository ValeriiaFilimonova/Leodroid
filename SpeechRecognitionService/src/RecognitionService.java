import edu.cmu.sphinx.api.Configuration;
import edu.cmu.sphinx.api.LiveSpeechRecognizer;
import edu.cmu.sphinx.api.SpeechResult;

import java.io.IOException;

public class RecognitionService {
    private static LiveSpeechRecognizer recognizer;
    private static MessageBus messageBus;
    private static boolean LISTENING = true;

    private static class TerminationHook extends Thread {
        public void run() {
            LISTENING = false;
            messageBus.closeConnection();

            try {
                if (recognizer != null) {
                    recognizer.stopRecognition();
                }
            }
            catch (IllegalStateException ex) {
            }
        }
    }

    public static void main(String[] args) {
        try {
            Runtime.getRuntime().addShutdownHook(new TerminationHook());
            Configuration configuration = SphinxConfigurationFactory.getConfiguration();

            messageBus = new MessageBus();
            recognizer = new LiveSpeechRecognizer(configuration);

            recognizer.startRecognition(false);


            while (LISTENING) {
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
