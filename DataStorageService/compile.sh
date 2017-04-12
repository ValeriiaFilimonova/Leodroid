#!/bin/bash

cd $(dirname $0)
source ../env.opts

#npm install nexe -g

nexe -i ./src/DataService.js -o ./$EXE_PATH/$DATA_STORAGE_NAME
