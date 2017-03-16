public class VoiceMessage {
    private String message;
    private int length;

    public VoiceMessage(String message) {
        this.message = message;
        this.length = message.length();
    }

    public boolean startsWith(Command command) {
        return message.startsWith(command.getString());
    }

    public String extractName(Command command) {
        int commandLength = command.getString().length();

        if (Math.abs(length - commandLength) > 1) {
            return message.substring(commandLength + 1, length);
        } else {
            throw new ExtractingNameException();
        }
    }

    public class ExtractingNameException extends RuntimeException {
        @Override public String getMessage() {
            return message;
        }
    }
}
