package droid.api;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;
import redis.clients.jedis.JedisPubSub;

import java.util.function.Consumer;

public class Droid {
    private static final String HOST = "localhost";
    private static final String COMMANDS_QUEUE = "voice-commands";
    private static final String SPEECH_QUEUE = "text-synthesis";

    private static Droid instance;

    public static Droid getInstance() {
        if (instance == null) {
            instance = new Droid();
        }

        return instance;
    }

    private Jedis commandsQueue;
    private Jedis speechQueue;
    private JedisPubSub pubSub;

    private Droid() {
        JedisPool pool = new JedisPool(new JedisPoolConfig(), HOST);
        commandsQueue = pool.getResource();
        speechQueue = pool.getResource();
    }

    public void putCommand(String command) {
        commandsQueue.publish(COMMANDS_QUEUE, command);
    }

    public void say(String text) {
        speechQueue.publish(SPEECH_QUEUE, text);
    }

    public void listen(Consumer<String> listener) {
        pubSub = new JedisPubSub() {
            @Override
            public void onMessage(String channel, String message) {
                listener.accept(message);
            }
        };
        commandsQueue.subscribe(pubSub, COMMANDS_QUEUE);
    }

    public void destroy() {
        pubSub.unsubscribe();
        speechQueue.quit();
        commandsQueue.quit();
    }
}
