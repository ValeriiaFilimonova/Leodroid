import com.rabbitmq.client.BuiltinExchangeType;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

public class MessageBus {
    private final static String EXCHANGE_NAME = "voice-commands";
    private final static String HOST = "localhost";
    private final static String ROUTING_KEY = "";

    private Channel channel;

    private Connection establishConnection() {
        try {
            ConnectionFactory factory = new ConnectionFactory() {{
                setHost(HOST);
            }};
            return factory.newConnection();
        }
        catch (IOException | TimeoutException ex) {
            throw new RabbitException(RabbitException.Errors.CONNECTION_ERROR, ex);
        }
    }

    private Channel createExchangeChannel(Connection connection) {
        try {
            Channel channel = connection.createChannel();
            channel.exchangeDeclare(EXCHANGE_NAME, BuiltinExchangeType.FANOUT);
            return channel;
        }
        catch (IOException ex) {
            throw new RabbitException(RabbitException.Errors.CHANNEL_ERROR, ex);
        }
    }

    public MessageBus() {
        Connection connection = establishConnection();
        channel = createExchangeChannel(connection);
    }

    public void sendMessage(String message) {
        try {
            channel.basicPublish(EXCHANGE_NAME, ROUTING_KEY, null, message.getBytes());
        }
        catch (IOException ex) {
            throw new RabbitException(RabbitException.Errors.SEND_MESSAGE_ERROR, ex);
        }
    }
}
