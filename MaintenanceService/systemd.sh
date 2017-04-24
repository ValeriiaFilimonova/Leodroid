#!/bin/bash

cd $(dirname $0)
source ../env.opts

MAINTENANCE_UNIT_FILE="
[Unit]
Description=NodeJS Service for Installing/Uninstalling of New Apps
OnFailure=${FAILURE_MONITORING_SERVICE_NAME}

[Service]
Type=simple
Restart=always
RestartSec=10
ExecStartPost=/bin/bash ${ON_START_SCRIPT} %p
ExecStopPost=/bin/bash ${ON_STOP_SCRIPT} %p
ExecStart=${SERVICES_PATH}/${MAINTENANCE_NAME}/${MAINTENANCE_NAME}
"

echo -e "$MAINTENANCE_UNIT_FILE" > $UNITS_PATH/$MAINTENANCE_SERVICE_NAME
