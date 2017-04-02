import logger.ManagingServiceLogger;
import rabbitmq.MessageBusFactory;
import rabbitmq.TextSynthesisBus;
import rabbitmq.VoiceCommandBus;
import sun.misc.Signal;
import sun.misc.SignalHandler;

public class ManagingService implements SignalHandler {
    private ManagingServiceLogger logger = ManagingServiceLogger.getInstance(ManagingService.class);

    private VoiceCommandBus commandBus = MessageBusFactory.getVoiceCommandBus();
    private TextSynthesisBus synthesisBus = MessageBusFactory.getTextSynthesisBus();

    private boolean tryToExecute(Command command, VoiceMessage message) {
        if (message.startsWith(command)) {
            logger.logMessage("Incoming message: " + message.toString());
            String answer;

            try {
                String applicationName = message.extractName(command);
                CommandExecutionResult result = command.execute(applicationName);
                answer = result.getMessage();

            }
            catch (VoiceMessage.ExtractingNameException ex) {
                answer = "Sorry, didn't recognize application name";
            }
            catch (Exception ex) {
                answer = "Sorry, something went wrong";
                logger.logRuntimeException(ex);
            }

            synthesisBus.sendText(answer);
            logger.logMessage("Oucoming message: " + answer);
            return true;
        }

        return false;
    }

    void start() {
        logger.logMessage("Service started");
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
        logger.logMessage("Service stopped");
    }

    public static void main(String... args) throws Exception {
        ManagingService managingService = new ManagingService();

        Signal.handle(new Signal("TERM"), managingService);
        Signal.handle(new Signal("ABRT"), managingService);
        Signal.handle(new Signal("INT"), managingService);

        managingService.start();
    }
}
