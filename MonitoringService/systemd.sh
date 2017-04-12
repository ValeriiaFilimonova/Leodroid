#!/bin/bash

cd $(dirname $0)

source ../env.opts

FAILURE_MONITORING_UNIT_FILE="
[Unit]
Description=Bash Script To Run On Service Failure

[Service]
Type=simple
Restart=on-failure
ExecStart=/bin/bash $SERVICES_PATH/OnFailureScript.sh
"

echo -e "$FAILURE_MONITORING_UNIT_FILE" > $UNITS_PATH/$FAILURE_MONITORING_SERVICE_NAME
echo "$FAILURE_MONITORING_SERVICE_NAME -> done"
