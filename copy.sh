#!/bin/bash

cd $(dirname $0)
source env.opts

# copy folders with dependencies and services

if [ -d "$DEPENDENCIES_PATH" ];
then
    rm -r $DEPENDENCIES_PATH
fi
if [ -d "$SERVICES_PATH" ];
then
    rm -r $SERVICES_PATH
fi

cp -r lib $DEPS_PATH
cp -r exe $SERVICES_PATH
cp units/* $SYSTEMD_PATH
cp -r ./MonitoringService/src/*.sh $SERVICES_PATH
cp -r SpeechRecognitionService/src/models $SERVICES_PATH

echo "files copied"
