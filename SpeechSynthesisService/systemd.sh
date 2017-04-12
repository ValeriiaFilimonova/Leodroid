#!/bin/bash

cd $(dirname $0)
source ../env.opts

SPEECH_SYNTHESIS_UNIT_FILE="
[Unit]
Description=C++ Espeak Based Speech Synthesis Service
Requires=rabbitmq-server.service

[Service]
Type=simple
Restart=always
ExecStart=${SERVICES_PATH}/${SPEECH_SYNTHESIS_NAME}
"

echo -e "$SPEECH_SYNTHESIS_UNIT_FILE" > $UNITS_PATH/$SPEECH_SYNTHESIS_SERVICE_NAME
echo "$SPEECH_SYNTHESIS_SERVICE_NAME -> done"
