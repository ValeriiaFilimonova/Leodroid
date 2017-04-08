#include <cstring>
#include "Logger.h"

Logger *Logger::instance = 0;

Logger Logger::getInstance() {
    if (!instance) {
        instance = new Logger("SynthesisService");
    }

    return *instance;
}

Logger::Logger(std::string name) {
    Logger::name = name;
}

std::string Logger::getDateTime() {
    time_t rawtime;
    struct tm *local_datetime;
    char date[DATE_LENGTH];

    time(&rawtime);
    local_datetime = localtime(&rawtime);

    strftime(date, sizeof(date), "%Y-%m-%d %I:%M:%S", local_datetime);

    return std::string(date);
}

void Logger::print(std::string level, std::string message) {
    unsigned long buffer_size = level.length() + name.length() + message.length() + SPECIAL_SYMBOLS_COUNT + DATE_LENGTH;
    char log[buffer_size];

    sprintf(log, "%s [%s] %s - %s", this->getDateTime().c_str(), level.c_str(), name.c_str(), message.c_str());

    std::cout << log << std::endl;
}

void Logger::info(std::string message) {
    this->print("INFO", message);
}

void Logger::error(std::string message) {
    this->print("ERROR", message);
}
