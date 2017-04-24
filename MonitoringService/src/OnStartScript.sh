#!/bin/bash

UNIT_NAME="$1"
STORAGE_HOST="http://localhost:8888/storage/statuses"

curl -X PATCH -H "Content-Type: application/json" -d "{\"$UNIT_NAME\": \"running\"}" $STORAGE_HOST
