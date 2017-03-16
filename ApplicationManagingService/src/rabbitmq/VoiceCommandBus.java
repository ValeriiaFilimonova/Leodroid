package rabbitmq;

import com.rabbitmq.client.*;

import java.io.IOException;
import java.util.function.Consumer;

public class VoiceCommandBus extends MessageBus {
    private final static String EXCHANGE_NAME = "voice-commands";
    private final static String ROUTING_KEY = "";

    @Override
    protected Channel createChannel(Connection connection) {
        try {
            Channel channel = connection.createChannel();
            channel.exchangeDeclare(EXCHANGE_NAME, BuiltinExchangeType.FANOUT);
            return channel;
        }
        catch (IOException ex) {
            throw new RabbitException(RabbitException.Errors.CHANNEL_ERROR, ex);
        }
    }

    @Override
    protected String createQueue(Channel channel) {
        try {
            String queueName = channel.queueDeclare().getQueue();
            channel.queueBind(queueName, EXCHANGE_NAME, ROUTING_KEY);
            return queueName;
        }
        catch (IOException ex) {
            throw new RabbitException(RabbitException.Errors.QUEUE_ERROR, ex);
        }
    }

    public void setConsumer(Consumer<String> callback) {
        try {
            DefaultConsumer consumer = new DefaultConsumer(channel) {
                @Override
                public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties,
                                           byte[] body) throws IOException {
                    String message = new String(body, "UTF-8");
                    callback.accept(message);
                }
            };
            channel.basicConsume(queue, true, consumer);
        }
        catch (IOException ex) {
            throw new RabbitException(RabbitException.Errors.SET_CONSUMER_ERROR, ex);
        }
    }
}
