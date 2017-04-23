#!/bin/bash

cd $(dirname $0)
source ../env.opts

SPEECH_SYNTHESIS_UNIT_FILE="
[Unit]
Description=C++ Espeak Based Speech Synthesis Service
Requires=rabbitmq-server.service
OnFailure=${FAILURE_MONITORING_SERVICE_NAME}

[Service]
Type=simple
Restart=always
RestartSec=5
ExecStart=${SERVICES_PATH}/${SPEECH_SYNTHESIS_NAME}/${SPEECH_SYNTHESIS_NAME}
ExecStartPost=/bin/bash ${ON_START_SCRIPT} %p
ExecStopPost=/bin/bash ${ON_STOP_SCRIPT} %p
"

echo -e "$SPEECH_SYNTHESIS_UNIT_FILE" > $UNITS_PATH/$SPEECH_SYNTHESIS_SERVICE_NAME
echo "$SPEECH_SYNTHESIS_SERVICE_NAME -> done"
