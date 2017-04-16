#!/bin/bash

cd $(dirname $0)
source ../env.opts

SPEECH_RECOGNITION_UNIT_FILE="
[Unit]
Description=Java Sphinx Speech Recognition Service
Requires=rabbitmq-server.service
After=${DATA_STORAGE_SERVICE_NAME}
OnFailure=${FAILURE_MONITORING_SERVICE_NAME}

[Service]
Type=simple
Restart=always
RestartSec=5
Environment=\"MODELS_PATH=${SERVICES_PATH}/models/\"
ExecStart=/usr/bin/java -cp ${DEPENDENCIES_PATH}/*:${DEPENDENCIES_PATH}/${SPEECH_RECOGNITION_NAME}/*:${SERVICES_PATH}/${SPEECH_RECOGNITION_NAME}.jar RecognitionService
ExecStartPost=/bin/bash ${ON_START_SCRIPT} %p
ExecStopPost=/bin/bash ${ON_STOP_SCRIPT} %p
"

echo -e "$SPEECH_RECOGNITION_UNIT_FILE" > $UNITS_PATH/$SPEECH_RECOGNITION_SERVICE_NAME
echo "$SPEECH_RECOGNITION_SERVICE_NAME -> done"
