#!/bin/bash

cd $(dirname $0)

SYSTEMD_PATH="/etc/systemd/system"

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

echo "unit files created"

# In file /etc/java-8-openjdk/sound.properties comment PulseAudio settings and uncomment DirectAudioProvider if LineUnavailable error

systemctl daemon-reload
systemctl reenable $SPEECH_RECOGNITION_NAME

echo "services enabled"

#systemctl start $SPEECH_RECOGNITION_NAME
