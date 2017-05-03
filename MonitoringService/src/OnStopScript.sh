#!/bin/bash

UNIT_NAME="$1"
STORAGE_HOST="http://localhost:8888/storage/statuses"
MONITORING_FILE="/home/root/exe/stopped-services.txt"

if [ ! -f "$MONITORING_FILE" ]
then
    touch $MONITORING_FILE
fi

echo "$UNIT_NAME" >> $MONITORING_FILE
curl -X PATCH -H "Content-Type: application/json" -d "{\"$UNIT_NAME\": \"stopped\"}" $STORAGE_HOST
