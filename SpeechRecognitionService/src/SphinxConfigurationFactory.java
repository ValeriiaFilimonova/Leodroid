import edu.cmu.sphinx.api.Configuration;

public class SphinxConfigurationFactory {
    private static String LANGUAGE = "en";

    private static String PATH = "file:/home/valera/Documents/IdeaProjects/" +
                                 "DroidSystem/SpeechRecognitionService/src/models/" + LANGUAGE;
    private static String ACOUSTIC_MODEL_PATH = PATH + "/acoustic";
    private static String DICTIONARY_PATH = PATH + "/dictionary.dict";
    private static String LANGUAGE_MODEL_PATH = PATH + "/language.lm";
    private static String GRAMMAR_NAME = "grammar";

    public static Configuration getConfiguration() {
        return new Configuration() {{
            setAcousticModelPath(ACOUSTIC_MODEL_PATH);
            setDictionaryPath(DICTIONARY_PATH);
            setLanguageModelPath(LANGUAGE_MODEL_PATH);
            setGrammarPath(PATH);
            setGrammarName(GRAMMAR_NAME);
            setUseGrammar(true);
        }};
    }
}
