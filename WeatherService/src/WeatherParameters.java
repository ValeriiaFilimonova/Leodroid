public enum WeatherParameters {
    TEMPERATURE("temperature in", " %.1f degrees"),
    HUMIDITY("humidity in", " %.1f percent"),
    PRESSURE("pressure in", " %.1f millimeters");

    private String commandStart;
    private String responseFormat;

    WeatherParameters(String commandStart, String responseFormat) {
        this.commandStart = commandStart;
        this.responseFormat = responseFormat;
    }

    public String getCommandStart() {
        return commandStart;
    }

    public String getResponseFormat() {
        return responseFormat;
    }

    @Override public String toString() {
        return commandStart;
    }
}
