import rabbitmq.MessageBusFactory;
import rabbitmq.TextSynthesisBus;
import rabbitmq.VoiceCommandBus;
import sun.misc.Signal;
import sun.misc.SignalHandler;
import systemd.ServiceManager;

public class ManagingService implements SignalHandler {
    private VoiceCommandBus commandBus = MessageBusFactory.getVoiceCommandBus();
    private TextSynthesisBus synthesisBus = MessageBusFactory.getTextSynthesisBus();

    private boolean tryToExecute(Command command, VoiceMessage message) {
        if (message.startsWith(command)) {
            try {
                String applicationName = message.extractName(command);
                ServiceManager.Status status = command.execute(applicationName);

                switch (status) {
                    case SUCCESS:
                        synthesisBus.sendText(command.getSuccessMessage(applicationName));
                        break;
                    case FAILURE:
                        synthesisBus.sendText(command.getFailureMessage(applicationName));
                        break;
                }
            }
            catch (VoiceMessage.ExtractingNameException ex) {
                synthesisBus.sendText("Sorry, didn't recognize application name");
            }
            finally {
                return true;
            }
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
