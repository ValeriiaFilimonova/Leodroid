#!/bin/bash

cd $(dirname $0)
source ./env.opts

# copy folders with dependencies and services

if [ -d "$DEPS_PATH" ];
then
    rm -r $DEPS_PATH
else
    mkdir -p $DEPS_PATH
fi

if [ -d "$SERVICES_PATH" ];
then
    rm -r $SERVICES_PATH
else
    mkdir -p $SERVICES_PATH
fi

if [ -d "$MODELS_PATH" ];
then
    rm -r $MODELS_PATH
else
    mkdir -p $MODELS_PATH
fi

if [ ! -d "$SYSTEMD_PATH" ];
then
    mkdir -p $SYSTEMD_PATH
fi

cp -r ./lib $DEPS_PATH
cp -r ./exe $SERVICES_PATH
cp -r ./units/* $SYSTEMD_PATH
cp -r ./MonitoringService/src/*.sh $SERVICES_PATH
cp -r ./SpeechRecognitionService/src/models $MODELS_PATH

echo "files copied"
