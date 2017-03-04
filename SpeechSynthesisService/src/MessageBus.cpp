#include "TcpHandler.h"
#include "MessageBus.h"

MessageBus::MessageBus(AMQP::ConnectionHandler *handler, std::string queueName) {
    AMQP::Login credentials = AMQP::Login("guest", "guest");
    AMQP::Connection *connection = new AMQP::Connection(handler, credentials);

    MessageBus::channel = new AMQP::Channel(connection);
    (*MessageBus::channel).declareQueue(queueName);
}

void MessageBus::setConsumer(AMQP::MessageCallback callback) {
    (*MessageBus::channel).consume(MessageBus::queueName, AMQP::noack)
            .onReceived(callback);
}
