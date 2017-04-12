#!/bin/bash

cd $(dirname $0)
source ../env.opts

SPEECH_RECOGNITION_UNIT_FILE="
[Unit]
Description=Java Sphinx Speech Recognition Service
Requires=rabbitmq-server.service

[Service]
Type=simple
Restart=always
Environment=\"MODELS_PATH=${SERVICES_PATH}/models/\"
ExecStart=/usr/bin/java -cp ${DEPENDENCIES_PATH}/*:${DEPENDENCIES_PATH}/${SPEECH_RECOGNITION_NAME}/*:${SERVICES_PATH}/${SPEECH_RECOGNITION_NAME}.jar RecognitionService
"

echo -e "$SPEECH_RECOGNITION_UNIT_FILE" > $UNITS_PATH/$SPEECH_RECOGNITION_SERVICE_NAME
echo "$SPEECH_RECOGNITION_SERVICE_NAME -> done"
