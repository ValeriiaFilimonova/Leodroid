#include "../espeak.h"
#include "SpeechSynthesizer.h"

SpeechSynthesizer::SpeechSynthesizer() {
    espeak_Initialize(AUDIO_OUTPUT_PLAYBACK, 0, NULL, 0);
    espeak_SetParameter(espeakWORDGAP, 5, 1);
}

void SpeechSynthesizer::speak(std::string text) {
    // TODO here must be very impressive logic
    espeak_Synchronize();
    espeak_Synth(text.c_str(), sizeof(text), 0, POS_WORD, 0, espeakCHARS_AUTO | espeakENDPAUSE, NULL, NULL);
}

void SpeechSynthesizer::setVoice(std::string name) {
    espeak_SetVoiceByName(name.c_str());
}

void SpeechSynthesizer::listVoices() {
    const espeak_VOICE **voices = espeak_ListVoices(NULL);
    int i = 0;
    while (voices) {
        printf("%s; %s\n", voices[i]->name, voices[i]->languages);
        i++;
    }
}
