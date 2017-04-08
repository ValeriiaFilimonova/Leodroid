package rabbitmq;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

public abstract class MessageBus {
    private final static String HOST = "localhost";

    private Connection connection;
    protected Channel channel;
    protected String queue;

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

    protected abstract Channel createChannel(Connection connection);

    protected abstract String createQueue(Channel channel);

    MessageBus() {
        connection = establishConnection();
        channel = createChannel(connection);
        queue = createQueue(channel);
    }

    public void closeConnection() {
        try {
            if (channel.isOpen()) {
                channel.close();
            }
            if (connection.isOpen()) {
                connection.close();
            }
        }
        catch (TimeoutException | IOException ex) {
            throw new RabbitException(RabbitException.Errors.CLOSE_CONNECTION_ERROR, ex);
        }
    }
}
