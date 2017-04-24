package message.bus;

public class MessageBusFactory {
    public static VoiceCommandBus getVoiceCommandBus() {
        return new VoiceCommandBus();
    }

    public static TextSynthesisBus getTextSynthesisBus() {
        return new TextSynthesisBus();
    }
}
