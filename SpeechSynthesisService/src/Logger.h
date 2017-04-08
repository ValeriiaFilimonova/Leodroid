#ifndef SPEECHSYNTHESISSERVICE_LOGGER_H
#define SPEECHSYNTHESISSERVICE_LOGGER_H

#include <iostream>

class Logger {
    static Logger *instance;

    Logger(std::string name);

public:
    static const unsigned int SPECIAL_SYMBOLS_COUNT = 7;

    static const unsigned int DATE_LENGTH = 20;

    static Logger getInstance();

    void info(std::string message);

    void error(std::string message);

private:
    std::string name;

    std::string getDateTime();

    void print(std::string level, std::string message);
};


#endif //SPEECHSYNTHESISSERVICE_LOGGER_H
