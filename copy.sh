#!/bin/bash

cd $(dirname $0)
source ./env.opts

echo -e "-----STARTED COPYING FILES-----\n"

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

rm -rf $MODELS_PATH
mkdir -p $MODELS_PATH

if [ ! -d "$SYSTEMD_PATH" ];
then
    mkdir -p $SYSTEMD_PATH
fi

cp -r ./lib $DEPS_PATH
cp -r ./exe $SERVICES_PATH
cp -r ./units/* $SYSTEMD_PATH
cp -r ./MonitoringService/src/*.sh $SERVICES_PATH
cp -r ./SpeechRecognitionService/src/models/* $MODELS_PATH

echo -e "-----FILES COPIED-----\n"
