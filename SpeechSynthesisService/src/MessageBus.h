#ifndef TTS_MESSAGEBUS_H
#define TTS_MESSAGEBUS_H

#include <Poco/Net/StreamSocket.h>
#include <amqpcpp.h>

class MessageBus {
public:
    MessageBus(AMQP::ConnectionHandler *handler, std::string queueName);

    void setConsumer(AMQP::MessageCallback callback);

private:
    std::string queueName;
    AMQP::Channel *channel;
};


#endif //TTS_MESSAGEBUS_H
