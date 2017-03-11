#!/bin/bash

cd $(dirname $0)

JAR_PATH="/usr/bin/droid-system"
LIB_PATH="/usr/lib/droid-system"
SYSTEMD_PATH="/etc/systemd/system"

SPEECH_RECOGNITION_NAME="speech-recognition.service"
SPEECH_RECOGNITION_UNIT_FILE="
[Unit]
Description=Java Sphinx Speech Recognition Service

[Service]
Type=forking
ExecStart=/usr/bin/java -cp ${LIB_PATH}/*:${JAR_PATH}/SpeechRecognitionService.jar RecognitionService

[Install]
WantedBy=multi-user.target"

touch $SYSTEMD_PATH/$SPEECH_RECOGNITION_NAME
chmod 664 $SYSTEMD_PATH/$SPEECH_RECOGNITION_NAME
echo $SPEECH_RECOGNITION_UNIT_FILE >> $SYSTEMD_PATH/$SPEECH_RECOGNITION_NAME

# In file /etc/java-8-openjdk/sound.properties comment PulseAudio settings and uncomment DirectAudioProvider if LineUnavailable error

systemctl daemon-reload

systemctl enable $SPEECH_RECOGNITION_NAME
systemctl start $SPEECH_RECOGNITION_NAME
