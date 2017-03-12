#include <iostream>
#include <csignal>

#include "src/TcpHandler.h"
#include "src/SpeechSynthesizer.h"
#include "src/MessageBus.h"

static std::string QUEUE_NAME = "text-synthesis";
static TcpHandler handler("localhost", 5672);

void onCancel(int signal) {
    handler.quit();
    exit(0);
}

int main() {
    signal(SIGTERM /*| SIGABRT |SIGKILL*/, onCancel);

    SpeechSynthesizer *synthesizer = new SpeechSynthesizer();

    AMQP::MessageCallback callback = [synthesizer]
            (const AMQP::Message &message,
             uint64_t deliveryTag,
             bool redelivered) {

        synthesizer->speak(message.message());
    };

    MessageBus *messageBus = new MessageBus(&handler, QUEUE_NAME);
    messageBus->setConsumer(callback);

    handler.loop();
    return 0;
}
