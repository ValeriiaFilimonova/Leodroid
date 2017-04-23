#!/bin/bash

cd $(dirname $0)
source ../env.opts

DATA_STORAGE_UNIT_FILE="
[Unit]
Description=NodeJS Redis Based Data Storage Service
Requires=redis-server.service

[Service]
Type=simple
Restart=on-failure
ExecStart=${SERVICES_PATH}/${DATA_STORAGE_NAME}/${DATA_STORAGE_NAME}
"

echo -e "$DATA_STORAGE_UNIT_FILE" > $UNITS_PATH/$DATA_STORAGE_SERVICE_NAME
echo "$DATA_STORAGE_SERVICE_NAME -> done"
