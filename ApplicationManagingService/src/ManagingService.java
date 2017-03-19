import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import rabbitmq.MessageBusFactory;
import rabbitmq.TextSynthesisBus;
import rabbitmq.VoiceCommandBus;
import sun.misc.Signal;
import sun.misc.SignalHandler;

public class ManagingService implements SignalHandler {
    private static Logger LOGGER;

    static {
        System.setProperty("org.slf4j.simpleLogger.showDateTime", "true");
        System.setProperty("org.slf4j.simpleLogger.dateTimeFormat", "yyyy-MM-dd' 'HH:mm:ss");
        System.setProperty("org.slf4j.simpleLogger.showThreadName", "false");

        LOGGER = LoggerFactory.getLogger(ManagingService.class);
    }

    private VoiceCommandBus commandBus = MessageBusFactory.getVoiceCommandBus();
    private TextSynthesisBus synthesisBus = MessageBusFactory.getTextSynthesisBus();

    private boolean tryToExecute(Command command, VoiceMessage message) {
        if (message.startsWith(command)) {
            LOGGER.info("Incoming message: " + message.toString());
            String answer;

            try {
                String applicationName = message.extractName(command);
                CommandExecutionResult result = command.execute(applicationName);
                answer = result.getMessage();

            }
            catch (VoiceMessage.ExtractingNameException ex) {
                answer = "Sorry, didn't recognize application name";
            }

            synthesisBus.sendText(answer);
            LOGGER.info("Outcoming message: " + answer);
            return true;
        }

        return false;
    }

    public void start() {
        commandBus.setConsumer((message) -> {
            VoiceMessage voiceMessage = new VoiceMessage(message);

            if (tryToExecute(Command.START_APPLICATION, voiceMessage)) {
                return;
            }
            if (tryToExecute(Command.STOP_APPLICATION, voiceMessage)) {
                return;
            }
        });
    }

    @Override public void handle(Signal signal) {
        commandBus.closeConnection();
        synthesisBus.closeConnection();
    }

    public static void main(String... args) throws Exception {
        ManagingService managingService = new ManagingService();

        Signal.handle(new Signal("TERM"), managingService);
        Signal.handle(new Signal("ABRT"), managingService);
        Signal.handle(new Signal("INT"), managingService);

        managingService.start();
    }
}
