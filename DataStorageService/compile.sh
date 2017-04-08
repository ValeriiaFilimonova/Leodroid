#!/bin/bash

cd $(dirname $0)

SERVICE_NAME="DataStorageService"
SERVICE_PATH="../service/"

#npm install nexe -g

nexe -i ./src/DataService.js -o ./$SERVICE_PATH/$SERVICE_NAME

