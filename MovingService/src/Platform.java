import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Platform {
    // Number of steps per full revolution
    private static final int STEPS_PER_REVOLUTION = 4096;

    // Revolutions per minute
    private static final int SPEED = 5;

    // Number of steps equal to one full revolution
    private static final int FIXED_NUMBER_OF_STEPS = 1024;

    private upm_uln200xa.ULN200XA motor = new upm_uln200xa.ULN200XA(
            STEPS_PER_REVOLUTION,
            Pins.MOTORS_I1.getPin(),
            Pins.MOTORS_I2.getPin(),
            Pins.MOTORS_I3.getPin(),
            Pins.MOTORS_I4.getPin()
    );

    private RotationDirection rotationDirection = RotationDirection.ClockWise;

    private Thread thread = null;

    private Logger logger = LoggerFactory.getLogger(Platform.class);

    private boolean isRotating() {
        return thread != null && thread.isAlive() && !thread.isInterrupted();
    }

    private void startRotating() {
        if (!isRotating()) {
            thread = new Thread(() -> {
                while (!thread.isInterrupted()) {
                    logger.info("started rotating");
                    motor.stepperSteps(FIXED_NUMBER_OF_STEPS);
                }
            });

            thread.start();
        }
    }

    private void stopRotating() throws InterruptedException {
        motor.release();
        thread.interrupt();
        thread.join();
        logger.info("stopped rotating");
    }

    public void moveStraight() {
        if (isRotating()) {
            return;
        }

        switch (rotationDirection) {
            case ClockWise:
                motor.setDirection(upm_uln200xa.ULN200XA_DIRECTION_T.ULN200XA_DIR_CW);
                break;
            case ContraClockWise:
                motor.setDirection(upm_uln200xa.ULN200XA_DIRECTION_T.ULN200XA_DIR_CCW);
                break;
        }

        startRotating();
    }

    public void moveBack() throws InterruptedException {
        switch (rotationDirection) {
            case ClockWise:
                motor.setDirection(upm_uln200xa.ULN200XA_DIRECTION_T.ULN200XA_DIR_CCW);
                break;
            case ContraClockWise:
                motor.setDirection(upm_uln200xa.ULN200XA_DIRECTION_T.ULN200XA_DIR_CW);
                break;
        }

        logger.info("changed rotationDirection");

        if (!isRotating()) {
            startRotating();
        }
    }

    public void stop() throws InterruptedException {
        if (isRotating()) {
            stopRotating();
        }
    }
}
