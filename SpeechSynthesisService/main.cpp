#include <iostream>

#include "src/TcpHandler.h"
#include "src/SpeechSynthesizer.h"
#include "src/MessageBus.h"

static std::string QUEUE_NAME = "text-synthesis";

int main() {
    TcpHandler *handler = new TcpHandler("localhost", 5672);
    SpeechSynthesizer *synthesizer = new SpeechSynthesizer();

    AMQP::MessageCallback callback = [synthesizer]
            (const AMQP::Message &message,
             uint64_t deliveryTag,
             bool redelivered) {

        synthesizer->speak(message.message());
    };

    MessageBus *messageBus = new MessageBus(handler, QUEUE_NAME);
    messageBus->setConsumer(callback);

    (*handler).loop();
    return 0;
}
