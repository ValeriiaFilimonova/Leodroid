#!/bin/bash

cd $(dirname $0)
source ../env.opts

NAME=$SPEECH_RECOGNITION_NAME
SPEECH_RECOGNITION_UNIT_FILE="
[Unit]
Description=Java Sphinx Speech Recognition Service
OnFailure=${FAILURE_MONITORING_SERVICE_NAME}

[Service]
Type=simple
Restart=always
RestartSec=5
Environment=\"MODELS_PATH=${MODELS_PATH}/\"
ExecStart=/usr/bin/java -cp ${DEPS_PATH}/*:${DEPS_PATH}/${NAME}/*:${SERVICES_PATH}/${NAME}/${NAME}.jar RecognitionService
ExecStartPost=/bin/bash ${ON_START_SCRIPT} %p
ExecStopPost=/bin/bash ${ON_STOP_SCRIPT} %p
"

echo -e "$SPEECH_RECOGNITION_UNIT_FILE" > $UNITS_PATH/$SPEECH_RECOGNITION_SERVICE_NAME
