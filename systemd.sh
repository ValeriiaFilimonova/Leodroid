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
Requires=rabbitmq-server.service

[Service]
Type=simple
Restart=always
Environment=\"MODELS_PATH=${SERVICES_PATH}/models/\"
ExecStart=/usr/bin/java -cp ${LIB_PATH}/*:${LIB_PATH}/${SPEECH_RECOGNITION_NAME}/*:${SERVICES_PATH}/${SPEECH_RECOGNITION_NAME}.jar RecognitionService
"

echo -e "$SPEECH_RECOGNITION_UNIT_FILE" > $SYSTEMD_PATH/$SPEECH_RECOGNITION_SERVICE_NAME
chmod 664 $SYSTEMD_PATH/$SPEECH_RECOGNITION_SERVICE_NAME

#SpeechSynthesisService

SPEECH_SYNTHESIS_SERVICE_NAME="speech-synthesis.service"
SPEECH_SYNTHESIS_NAME="SpeechSynthesisService"
SPEECH_SYNTHESIS_UNIT_FILE="
[Unit]
Description=C++ Espeak Based Speech Synthesis Service
Requires=rabbitmq-server.service

[Service]
Type=simple
Restart=always
ExecStart=${SERVICES_PATH}/${SPEECH_SYNTHESIS_NAME}
"

echo -e "$SPEECH_SYNTHESIS_UNIT_FILE" > $SYSTEMD_PATH/$SPEECH_SYNTHESIS_SERVICE_NAME
chmod 664 $SYSTEMD_PATH/$SPEECH_SYNTHESIS_SERVICE_NAME

#DataStorageService

DATA_STORAGE_SERVICE_NAME="data-storage.service"
DATA_STORAGE_NAME="DataStorageService"
DATA_STORAGE_UNIT_FILE="
[Unit]
Description=NodeJS Redis Based Data Storage Service
Requires=redis-server.service

[Service]
Type=simple
Restart=always
ExecStart=${SERVICES_PATH}/${DATA_STORAGE_NAME}
"

echo -e "$DATA_STORAGE_UNIT_FILE" > $SYSTEMD_PATH/$DATA_STORAGE_SERVICE_NAME
chmod 664 $SYSTEMD_PATH/$DATA_STORAGE_SERVICE_NAME

#ApplicationManagingService

APPLICATION_MANAGING_SERVICE_NAME="application-managing.service"
APPLICATION_MANAGING_NAME="ApplicationManagingService"
APPLICATION_MANAGING_UNIT_FILE="
[Unit]
Description=Java Systemctl Based Managing Service
Requires=${SPEECH_RECOGNITION_SERVICE_NAME} ${SPEECH_SYNTHESIS_SERVICE_NAME} ${DATA_STORAGE_SERVICE_NAME}

[Service]
Type=simple
Restart=always
ExecStart=/usr/bin/java -cp ${LIB_PATH}/*:${LIB_PATH}/${APPLICATION_MANAGING_NAME}/*:${SERVICES_PATH}/${APPLICATION_MANAGING_NAME}.jar ManagingService
"

echo -e "$APPLICATION_MANAGING_UNIT_FILE" > $SYSTEMD_PATH/$APPLICATION_MANAGING_SERVICE_NAME
chmod 664 $SYSTEMD_PATH/$APPLICATION_MANAGING_SERVICE_NAMEu

#Target to unite all services

TARGET_UNIT_FILE="
[Unit]
Description=Droid System Built-In Services Target
Requires=$SPEECH_RECOGNITION_SERVICE_NAME $SPEECH_SYNTHESIS_SERVICE_NAME $APPLICATION_MANAGING_SERVICE_NAME $DATA_STORAGE_SERVICE_NAME
After=$SPEECH_RECOGNITION_SERVICE_NAME $SPEECH_SYNTHESIS_SERVICE_NAME $APPLICATION_MANAGING_SERVICE_NAME $DATA_STORAGE_SERVICE_NAME
"
echo -e "$TARGET_UNIT_FILE" > $SYSTEMD_PATH/droid-builtin.target
chmod 664 $SYSTEMD_PATH/droid-builtin.target

echo "unit files created"

systemctl daemon-reload

echo "services enabled"
