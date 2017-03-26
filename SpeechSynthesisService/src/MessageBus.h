#ifndef SPEECHSYNTHESISSERVICE_MESSAGEBUS_H
#define SPEECHSYNTHESISSERVICE_MESSAGEBUS_H

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


#endif //SPEECHSYNTHESISSERVICE_MESSAGEBUS_H
