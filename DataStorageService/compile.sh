#!/bin/bash

cd $(dirname $0)
source ../env.opts

enclose ./src/DataService.js
cp src/DataService ./$EXE_PATH/$DATA_STORAGE_NAME/$DATA_STORAGE_NAME
rm src/DataService
