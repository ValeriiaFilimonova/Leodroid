#!/bin/bash

cd $(dirname $0)
source ../env.opts

npm install
enclose ./src/MaintenanceService.js
mv src/MaintenanceService ./$EXE_PATH/$MAINTENANCE_NAME/
