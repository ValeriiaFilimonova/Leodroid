#!/bin/bash

UNIT_NAME="$1"
STORAGE_HOST="http://localhost:8888/storage/statuses"
MONITORING_FILE="/usr/share/droid-system/stopped-services.txt"

echo "$UNIT_NAME" >> $MONITORING_FILE
curl -X PATCH -H "Content-Type: application/json" -d "{\"$UNIT_NAME\": \"stopped\"}" $STORAGE_HOST
