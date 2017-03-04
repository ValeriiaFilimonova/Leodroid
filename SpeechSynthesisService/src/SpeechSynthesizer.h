#ifndef TTS_SPEECHSYNTHESIZER_H
#define TTS_SPEECHSYNTHESIZER_H

#include <iostream>

class SpeechSynthesizer {
public:
    SpeechSynthesizer();

    void speak(std::string text);

private:
    void listVoices();

    void setVoice(std::string name);
};


#endif //TTS_SPEECHSYNTHESIZER_H
