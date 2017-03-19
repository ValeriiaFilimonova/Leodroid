import rabbitmq.MessageBusFactory;
import rabbitmq.TextSynthesisBus;
import rabbitmq.VoiceCommandBus;
import sun.misc.Signal;
import sun.misc.SignalHandler;

public class ManagingService implements SignalHandler {
    private VoiceCommandBus commandBus = MessageBusFactory.getVoiceCommandBus();
    private TextSynthesisBus synthesisBus = MessageBusFactory.getTextSynthesisBus();

    private boolean tryToExecute(Command command, VoiceMessage message) {
        if (message.startsWith(command)) {
            try {
                String applicationName = message.extractName(command);
                CommandExecutionResult result = command.execute(applicationName);
                synthesisBus.sendText(result.getMessage());
            }
            catch (VoiceMessage.ExtractingNameException ex) {
                synthesisBus.sendText("Sorry, didn't recognize application name");
            }
            return true;
        }

        return false;
    }

    public void start() {
        commandBus.setConsumer((message) -> {
            System.out.println(message);
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
