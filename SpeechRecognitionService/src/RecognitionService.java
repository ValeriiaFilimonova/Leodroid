import edu.cmu.sphinx.api.Configuration;
import edu.cmu.sphinx.api.LiveSpeechRecognizer;
import edu.cmu.sphinx.api.SpeechResult;

import java.io.IOException;

public class RecognitionService {
    public static void main(String[] args) {
        try {
            MessageBus messageBus = new MessageBus();
            Configuration configuration = SphinxConfigurationFactory.getConfiguration();
            LiveSpeechRecognizer recognizer = new LiveSpeechRecognizer(configuration);

            recognizer.startRecognition(true);

            while (true) {
                SpeechResult result = recognizer.getResult();
                String message = result.getHypothesis();
                messageBus.sendMessage(message);
            }
        } catch (IOException ex) {
            throw new SphinxException(ex);
        }
    }
}
