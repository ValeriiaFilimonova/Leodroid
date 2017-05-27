#!/bin/bash

cd $(dirname $0)
source ../env.opts

NAME=$MOVING_NAME
MOVING_UNIT_FILE="
[Unit]
Description=Java UPM Moving Service
OnFailure=${FAILURE_MONITORING_SERVICE_NAME}

[Service]
Type=simple
Restart=always
RestartSec=15
ExecStart=/usr/bin/java -cp ${DEPS_PATH}/*:${DEPS_PATH}/${NAME}/*:${SERVICES_PATH}/${NAME}/${NAME}.jar MovingService
ExecStartPost=/bin/bash ${ON_START_SCRIPT} %p
ExecStopPost=/bin/bash ${ON_STOP_SCRIPT} %p
"

echo -e "$MOVING_UNIT_FILE" > $UNITS_PATH/$MOVING_SERVICE_NAME
