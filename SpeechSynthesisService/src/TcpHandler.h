/*********************************************************************************
 * The MIT License (MIT)                                                         *
 *                                                                               *
 * Copyright (c) 2015 Dmitry Mukhitov                                            *
 *                                                                               *
 * Permission is hereby granted, free of charge, to any person obtaining a copy  *
 * of this software and associated documentation files (the "Software"), to deal *
 * in the Software without restriction, including without limitation the rights  *
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell     *
 * copies of the Software, and to permit persons to whom the Software is         *
 * furnished to do so, subject to the following conditions:                      *
 *                                                                               *
 * The above copyright notice and this permission notice shall be included in    *
 * all copies or substantial portions of the Software.                           *
 *                                                                               *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR    *
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,      *
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE   *
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER        *
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, *
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN     *
 * THE SOFTWARE.                                                                 *
 *          https://github.com/RPG-18/rabbitmq-cpp-tutorials                     *
 *********************************************************************************/


#ifndef SRC_SIMPLEPOCOHANDLER_H
#define SRC_SIMPLEPOCOHANDLER_H

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

#endif // SRC_SIMPLEPOCOHANDLER_H
