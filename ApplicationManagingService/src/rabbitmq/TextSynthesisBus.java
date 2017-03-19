package rabbitmq;

import com.rabbitmq.client.*;

import java.io.IOException;

public class TextSynthesisBus extends MessageBus {
    private final static String QUEUE_NAME = "text-synthesis";
    private final AMQP.BasicProperties basicProperties = new AMQP.BasicProperties.Builder()
            .deliveryMode(1)
            .expiration("1000")
            .build();

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
            channel.basicPublish("", queue, basicProperties, message.getBytes());
        }
        catch (IOException ex) {
            throw new RabbitException(RabbitException.Errors.SEND_MESSAGE_ERROR, ex);
        }
    }
}
