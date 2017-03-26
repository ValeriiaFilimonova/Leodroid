#ifndef SPEECHSYNTHESISSERVICE_SPEECHSYNTHESIZER_H
#define SPEECHSYNTHESISSERVICE_SPEECHSYNTHESIZER_H

#include <iostream>

class SpeechSynthesizer {
public:
    SpeechSynthesizer();

    void speak(std::string text);

private:
    void listVoices();

    void setVoice(std::string name);
};


#endif //SPEECHSYNTHESISSERVICE_SPEECHSYNTHESIZER_H
