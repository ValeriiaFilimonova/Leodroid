#!/bin/bash

cd $(dirname $0)
source ../env.opts

SPEECH_SYNTHESIS_UNIT_FILE="
[Unit]
Description=JavaScript Espeak Based Speech Synthesis Service
OnFailure=${FAILURE_MONITORING_SERVICE_NAME}

[Service]
Type=simple
Restart=always
RestartSec=5
ExecStartPost=/bin/bash ${ON_START_SCRIPT} %p
ExecStopPost=/bin/bash ${ON_STOP_SCRIPT} %p
ExecStart=${SERVICES_PATH}/${SPEECH_SYNTHESIS_NAME}/${SPEECH_SYNTHESIS_NAME}
"

echo -e "$SPEECH_SYNTHESIS_UNIT_FILE" > $UNITS_PATH/$SPEECH_SYNTHESIS_SERVICE_NAME
