#!/bin/bash

cd $(dirname $0)

source env.opts

SYSTEMD_PATH="/etc/systemd/system"

#SpeechRecognitionService

SPEECH_RECOGNITION_NAME="speech-recognition.service"
SPEECH_RECOGNITION_UNIT_FILE="
[Unit]
Description=Java Sphinx Speech Recognition Service

[Service]
Type=forking
Environment=\"MODELS_PATH=${SERVICES_PATH}/models/\"
ExecStart=/usr/bin/java -cp ${LIB_PATH}/*:${LIB_PATH}/SpeechRecognitionService/*:${SERVICES_PATH}/SpeechRecognitionService.jar RecognitionService

[Install]
WantedBy=multi-user.target"

echo -e "$SPEECH_RECOGNITION_UNIT_FILE" > $SYSTEMD_PATH/$SPEECH_RECOGNITION_NAME
chmod 664 $SYSTEMD_PATH/$SPEECH_RECOGNITION_NAME

#SpeechSynthesisService

SPEECH_SYNTHESIS_NAME="speech-synthesis.service"
SPEECH_SYNTHESIS_UNIT_FILE="
[Unit]
Description=C++ Espeak Based Speech Synthesis Service

[Service]
Type=forking
ExecStart=${SERVICES_PATH}/SpeechSynthesisService

[Install]
WantedBy=multi-user.target"

echo -e "$SPEECH_SYNTHESIS_UNIT_FILE" > $SYSTEMD_PATH/$SPEECH_SYNTHESIS_NAME
chmod 664 $SYSTEMD_PATH/$SPEECH_SYNTHESIS_NAME

echo "unit files created"

# In file /etc/java-8-openjdk/sound.properties comment PulseAudio settings and uncomment DirectAudioProvider if LineUnavailable error

systemctl daemon-reload
systemctl reenable $SPEECH_RECOGNITION_NAME
systemctl reenable $SPEECH_SYNTHESIS_NAME

echo "services enabled"

#systemctl start $SPEECH_RECOGNITION_NAME
