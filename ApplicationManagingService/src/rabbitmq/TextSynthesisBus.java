package rabbitmq;

import com.rabbitmq.client.*;

import java.io.IOException;

public class TextSynthesisBus extends MessageBus {
    private final static String QUEUE_NAME = "text-synthesis";

    @Override
    protected Channel createChannel(Connection connection) {
        try {
            return connection.createChannel();
        }
        catch (IOException ex) {
            throw new RabbitException(RabbitException.Errors.CHANNEL_ERROR, ex);
        }
    }

    @Override
    protected String createQueue(Channel channel) {
        try {
            channel.queueDeclare(QUEUE_NAME, false, false, false, null);
            return QUEUE_NAME;
        }
        catch (IOException ex) {
            throw new RabbitException(RabbitException.Errors.QUEUE_ERROR, ex);
        }
    }

    public void sendText(String message) {
        try {
            channel.basicPublish("", queue, null, message.getBytes());
        }
        catch (IOException ex) {
            throw new RabbitException(RabbitException.Errors.SEND_MESSAGE_ERROR, ex);
        }
    }
}
