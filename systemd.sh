#!/bin/bash

cd $(dirname $0)

source env.opts

SYSTEMD_PATH="/etc/systemd/system"

#SpeechRecognitionService

SPEECH_RECOGNITION_SERVICE_NAME="speech-recognition.service"
SPEECH_RECOGNITION_NAME="SpeechRecognitionService"
SPEECH_RECOGNITION_UNIT_FILE="
[Unit]
Description=Java Sphinx Speech Recognition Service

[Service]
Type=simple
Restart=on-failure
Environment=\"MODELS_PATH=${SERVICES_PATH}/models/\"
ExecStart=/usr/bin/java -cp ${LIB_PATH}/*:${LIB_PATH}/${SPEECH_RECOGNITION_NAME}/*:${SERVICES_PATH}/${SPEECH_RECOGNITION_NAME}.jar RecognitionService

[Install]
WantedBy=multi-user.target"

echo -e "$SPEECH_RECOGNITION_UNIT_FILE" > $SYSTEMD_PATH/$SPEECH_RECOGNITION_SERVICE_NAME
chmod 664 $SYSTEMD_PATH/$SPEECH_RECOGNITION_SERVICE_NAME

#SpeechSynthesisService

SPEECH_SYNTHESIS_SERVICE_NAME="speech-synthesis.service"
SPEECH_SYNTHESIS_NAME="SpeechSynthesisService"
SPEECH_SYNTHESIS_UNIT_FILE="
[Unit]
Description=C++ Espeak Based Speech Synthesis Service

[Service]
Type=simple
Restart=on-failure
ExecStart=${SERVICES_PATH}/${SPEECH_SYNTHESIS_NAME}

[Install]
WantedBy=multi-user.target"

echo -e "$SPEECH_SYNTHESIS_UNIT_FILE" > $SYSTEMD_PATH/$SPEECH_SYNTHESIS_SERVICE_NAME
chmod 664 $SYSTEMD_PATH/$SPEECH_SYNTHESIS_SERVICE_NAME

#ApplicationManagingService

APPLICATION_MANAGING_SERVICE_NAME="application-managing.service"
APPLICATION_MANAGING_NAME="ApplicationManagingService"
APPLICATION_MANAGING_UNIT_FILE="
[Unit]
Description=Java Systemctl Based Managing Service
Requires=${SPEECH_RECOGNITION_SERVICE_NAME} ${SPEECH_SYNTHESIS_SERVICE_NAME}

[Service]
Type=simple
ExecStart=/usr/bin/java -cp ${LIB_PATH}/*:${SERVICES_PATH}/${APPLICATION_MANAGING_NAME}.jar ManagingService

[Install]
WantedBy=multi-user.target"

echo -e "$APPLICATION_MANAGING_UNIT_FILE" > $SYSTEMD_PATH/$APPLICATION_MANAGING_SERVICE_NAME
chmod 664 $SYSTEMD_PATH/$APPLICATION_MANAGING_SERVICE_NAME

echo "unit files created"

systemctl daemon-reload
systemctl reenable $SPEECH_RECOGNITION_SERVICE_NAME
systemctl reenable $SPEECH_SYNTHESIS_SERVICE_NAME
systemctl reenable $APPLICATION_MANAGING_SERVICE_NAME

echo "services enabled"
