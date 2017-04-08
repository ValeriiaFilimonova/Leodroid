#include <iostream>
#include <csignal>

#include "src/TcpHandler.h"
#include "src/SpeechSynthesizer.h"
#include "src/MessageBus.h"
#include "src/Logger.h"

static std::string QUEUE_NAME = "text-synthesis";
static TcpHandler handler("localhost", 5672);
static Logger logger = Logger::getInstance();

void onCancel(int signal) {
    logger.info("Service stopped");
    handler.quit();
    exit(0);
}

int main() {
    signal(SIGTERM | SIGABRT | SIGKILL | SIGINT, onCancel);

    SpeechSynthesizer *synthesizer = new SpeechSynthesizer();

    AMQP::MessageCallback callback = [synthesizer]
            (const AMQP::Message &message,
             uint64_t deliveryTag,
             bool redelivered) {

        synthesizer->speak(message.message());
    };

    MessageBus *messageBus = new MessageBus(&handler, QUEUE_NAME);
    messageBus->setConsumer(callback);

    logger.info("Service started");
    handler.loop();
    return 0;
}
