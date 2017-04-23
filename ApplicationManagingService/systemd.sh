#!/bin/bash

cd $(dirname $0)
source ../env.opts

NAME=$APPLICATION_MANAGING_NAME
APPLICATION_MANAGING_UNIT_FILE="
[Unit]
Description=Java Systemctl Based Managing Service
OnFailure=${FAILURE_MONITORING_SERVICE_NAME}

[Service]
Type=simple
Restart=always
RestartSec=10
ExecStartPost=/bin/bash ${ON_START_SCRIPT} %p
ExecStopPost=/bin/bash ${ON_STOP_SCRIPT} %p
ExecStart=/usr/bin/java -cp ${DEPS_PATH}/*:${DEPS_PATH}/${NAME}/*:${SERVICES_PATH}/${NAME}/${NAME}.jar ManagingService
"

echo -e "$APPLICATION_MANAGING_UNIT_FILE" > $UNITS_PATH/$APPLICATION_MANAGING_SERVICE_NAME
echo "$APPLICATION_MANAGING_SERVICE_NAME -> done"
