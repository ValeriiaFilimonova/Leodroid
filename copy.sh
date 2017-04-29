#!/bin/bash

cd $(dirname $0)
source env.opts

# copy folders with dependencies and services

LOCAL_LIB="/usr/local/lib"

if [ -d "$DEPS_PATH" ];
then
    rm -r $DEPS_PATH
fi
if [ -d "$SERVICES_PATH" ];
then
    rm -r $SERVICES_PATH
fi
if [ ! -d "$LOCAL_LIB" ];
then
    mkdir -p /usr/local
    mkdir -p $LOCAL_LIB
fi

cp -r lib $DEPS_PATH
cp -r lib/$SPEECH_SYNTHESIS_NAME $LOCAL_LIB
cp -r exe $SERVICES_PATH
cp units/* $SYSTEMD_PATH
cp -r ./MonitoringService/src/*.sh $SERVICES_PATH
cp -r SpeechRecognitionService/src/models $SERVICES_PATH

echo "files copied"
