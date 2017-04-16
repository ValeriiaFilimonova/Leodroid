#!/bin/bash

cd $(dirname $0)
source env.opts

SYSTEMD_FILE="systemd.sh"
DIRECTORIES=($SPEECH_RECOGNITION_NAME $SPEECH_SYNTHESIS_NAME $DATA_STORAGE_NAME $APPLICATION_MANAGING_NAME $FAILURE_MONITORING_NAME)

for directory in "${DIRECTORIES[@]}"
do
    /bin/bash $directory/$SYSTEMD_FILE
done

#Target to unite all services

TARGET_UNIT_FILE="
[Unit]
Description=Droid System Built-In Services Target
Requires=$SPEECH_RECOGNITION_SERVICE_NAME $SPEECH_SYNTHESIS_SERVICE_NAME $APPLICATION_MANAGING_SERVICE_NAME
After=redis-server.service rabbitmq-server.service $DATA_STORAGE_SERVICE_NAME
"
echo -e "$TARGET_UNIT_FILE" > units/droid-system.target

echo "unit files created"
