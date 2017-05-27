public enum Pins {
    SERVOS_0(3),
    SERVOS_90(6),
    MOTORS_I1(8), MOTORS_I2(9), MOTORS_I3(10), MOTORS_I4(11);

    private int pin;

    private Pins(int pin) {
        this.pin = pin;
    }

    public int getPin() {
        return pin;
    }
}