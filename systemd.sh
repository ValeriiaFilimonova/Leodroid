#!/bin/bash

cd $(dirname $0)
source ./env.opts
mkdir -p units

echo -e "-----STARTED CREATING UNIT FILES-----\n"

SYSTEMD_FILE="systemd.sh"
DIRECTORIES=($SPEECH_RECOGNITION_NAME $SPEECH_SYNTHESIS_NAME $DATA_STORAGE_NAME $APPLICATION_MANAGING_NAME $FAILURE_MONITORING_NAME $MAINTENANCE_NAME $MOVING_NAME)

for directory in "${DIRECTORIES[@]}"
do
    /bin/bash $directory/$SYSTEMD_FILE
    echo -e "\t$directory -> DONE"
done

#Target to unite all services

TARGET_UNIT_FILE="
[Unit]
Description=Droid System Built-In Services Target
DefaultDependencies=no
Requires=$DATA_STORAGE_NAME $SPEECH_RECOGNITION_SERVICE_NAME $SPEECH_SYNTHESIS_SERVICE_NAME $APPLICATION_MANAGING_SERVICE_NAME $MAINTENANCE_SERVICE_NAME $MOVING_SERVICE_NAME
"
echo -e "$TARGET_UNIT_FILE" > units/droid-system.target

echo -e "\n-----UNIT FILES CREATED-----\n"
