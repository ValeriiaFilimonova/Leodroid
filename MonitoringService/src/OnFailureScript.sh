#!/bin/bash

STORAGE_HOST="http://localhost:8888/storage/statuses"
MONITORING_FILE="/home/root/exe/stopped-services.txt"
UNIT_NAME=$(cat $MONITORING_FILE | tail -1)

rm $MONITORING_FILE

curl -X PATCH -H "Content-Type: application/json" -d "{\"$UNIT_NAME\": \"failed\"}" $STORAGE_HOST
