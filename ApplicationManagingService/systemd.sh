#!/bin/bash

cd $(dirname $0)
source ../env.opts

APPLICATION_MANAGING_UNIT_FILE="
[Unit]
Description=Java Systemctl Based Managing Service
After=${DATA_STORAGE_SERVICE_NAME}
OnFailure=${FAILURE_MONITORING_SERVICE_NAME}

[Service]
Type=simple
Restart=always
RestartSec=10
ExecStartPost=/bin/bash ${ON_START_SCRIPT} %p
ExecStopPost=/bin/bash ${ON_STOP_SCRIPT} %p
ExecStart=/usr/bin/java -cp ${DEPENDENCIES_PATH}/*:${DEPENDENCIES_PATH}/${APPLICATION_MANAGING_NAME}/*:${SERVICES_PATH}/${APPLICATION_MANAGING_NAME}.jar ManagingService
"

echo -e "$APPLICATION_MANAGING_UNIT_FILE" > $UNITS_PATH/$APPLICATION_MANAGING_SERVICE_NAME
echo "$APPLICATION_MANAGING_SERVICE_NAME -> done"
