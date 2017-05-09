public class MovingService {
    public static void main(String[] args) throws InterruptedException {
        Platform platform = new Platform();

        platform.moveStraight();
        Thread.sleep(8000);

        platform.moveBack();
        Thread.sleep(5000);

        platform.stop();
    }
}
