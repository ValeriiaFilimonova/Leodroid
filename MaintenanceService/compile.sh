#!/bin/bash

cd $(dirname $0)
source ../env.opts

enclose ./src/MaintenanceService.js
mv src/MaintenanceService ./$EXE_PATH/$MAINTENANCE_NAME/
