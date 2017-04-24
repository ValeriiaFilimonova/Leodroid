import message.bus.MessageBusFactory;
import message.bus.TextSynthesisBus;
import message.bus.VoiceCommandBus;
import net.aksingh.owmjapis.CurrentWeather;
import net.aksingh.owmjapis.OpenWeatherMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import sun.misc.Signal;
import sun.misc.SignalHandler;

import java.io.IOException;
import java.util.function.Function;

public class WeatherService implements SignalHandler {
    private static String API_KEY = "1024bdcff81fa18f9a336cde538e45b0";

    static {
        System.setProperty("org.slf4j.simpleLogger.showDateTime", "true");
        System.setProperty("org.slf4j.simpleLogger.dateTimeFormat", "yyyy-MM-dd' 'HH:mm:ss");
        System.setProperty("org.slf4j.simpleLogger.showThreadName", "false");
    }

    private VoiceCommandBus commandBus = MessageBusFactory.getVoiceCommandBus();
    private TextSynthesisBus synthesisBus = MessageBusFactory.getTextSynthesisBus();
    private OpenWeatherMap openWeatherMap = new OpenWeatherMap(API_KEY);
    private Logger logger = LoggerFactory.getLogger(WeatherService.class);

    private CitiesDictionary cities = new CitiesDictionary();

    private CurrentWeather.Main getWeather(String name) {
        int code = cities.getCodeByName(name);

        return openWeatherMap
                .currentWeatherByCityCode(code)
                .getMainInstance();
    }

    private float getTemperature(String city) {
        return getWeather(city).getTemperature();
    }

    private float getHumidity(String city) {
        return getWeather(city).getHumidity();
    }

    private float getPressure(String city) {
        return getWeather(city).getPressure();
    }

    private String getCityFromMessage(String message, String command) {
        return message
                .replace(command, "")
                .trim()
                .toLowerCase();
    }

    private void runCommand(String message, WeatherParameters measure, Function<String, Float> request) {
        String city = getCityFromMessage(message, measure.getCommandStart());
        float value = request.apply(city);
        String response = String.format(measure.getResponseFormat(), value);
        synthesisBus.sendText(response);
        logger.info(message + response);
    }

    private void start() {
        logger.info("Service started");
        openWeatherMap.setUnits(OpenWeatherMap.Units.METRIC);
        commandBus.setConsumer((message) -> {
            try {
                if (message.startsWith(WeatherParameters.TEMPERATURE.toString())) {
                    runCommand(message, WeatherParameters.TEMPERATURE, this::getTemperature);
                }
                if (message.startsWith(WeatherParameters.HUMIDITY.toString())) {
                    runCommand(message, WeatherParameters.HUMIDITY, this::getHumidity);
                }
                if (message.startsWith(WeatherParameters.PRESSURE.toString())) {
                    runCommand(message, WeatherParameters.PRESSURE, this::getPressure);
                }
            }
            catch (IllegalArgumentException ex) {
                logger.warn(ex.getMessage());
            }
        });
    }

    @Override public void handle(Signal signal) {
        commandBus.closeConnection();
        synthesisBus.closeConnection();
        logger.info("Service stopped");
    }

    public static void main(String... args) throws IOException {
        WeatherService weatherService = new WeatherService();

        Signal.handle(new Signal("TERM"), weatherService);
        Signal.handle(new Signal("ABRT"), weatherService);
        Signal.handle(new Signal("INT"), weatherService);

        weatherService.start();
    }
}
