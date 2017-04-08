#include "TcpHandler.h"
#include "MessageBus.h"

MessageBus::MessageBus(AMQP::ConnectionHandler *handler, std::string queueName) {
    AMQP::Login credentials = AMQP::Login("guest", "guest");
    AMQP::Connection *connection = new AMQP::Connection(handler, credentials);

    MessageBus::channel = new AMQP::Channel(connection);

    AMQP::Table arguments; arguments["x-message-ttl"] = 1000;

    MessageBus::channel->declareQueue(queueName, AMQP::durable + AMQP::autodelete, arguments);
}

void MessageBus::setConsumer(AMQP::MessageCallback callback) {
    MessageBus::channel->consume(MessageBus::queueName, AMQP::noack)
            .onReceived(callback);
}
