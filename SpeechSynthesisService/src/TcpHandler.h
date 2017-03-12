#ifndef SRC_SIMPLEPOCOHANDLER_H_
#define SRC_SIMPLEPOCOHANDLER_H_

#include <memory>
#include <amqpcpp.h>

class TcpHandlerImpl;

class TcpHandler : public AMQP::ConnectionHandler {
public:

    static constexpr size_t BUFFER_SIZE = 8 * 1024 * 1024; //8Mb
    static constexpr size_t TEMP_BUFFER_SIZE = 1024 * 1024; //1Mb

    TcpHandler(const std::string &host, uint16_t port);

    virtual ~TcpHandler();

    void loop();

    void quit();

    bool connected() const;

private:

    TcpHandler(const TcpHandler &) = delete;

    TcpHandler &operator=(const TcpHandler &) = delete;

    void close();

    virtual void onData(
            AMQP::Connection *connection, const char *data, size_t size);

    virtual void onConnected(AMQP::Connection *connection);

    virtual void onError(AMQP::Connection *connection, const char *message);

    virtual void onClosed(AMQP::Connection *connection);

    void sendDataFromBuffer();

private:

    std::shared_ptr<TcpHandlerImpl> m_impl;
};

#endif /* SRC_SIMPLEPOCOHANDLER_H_ */