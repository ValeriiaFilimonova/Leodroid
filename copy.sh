#!/bin/bash

cd $(dirname $0)
source ./env.opts

echo -e "-----STARTED COPYING FILES-----\n"

mkdir -p $DEPS_PATH
mkdir -p $SERVICES_PATH
mkdir -p $MODELS_PATH

cp -rf ./lib/* $DEPS_PATH
cp -rf ./exe/* $SERVICES_PATH
cp -rf ./units/* $SYSTEMD_PATH
cp -rf ./MonitoringService/src/*.sh $SERVICES_PATH
cp -rf ./$SPEECH_RECOGNITION_NAME/src/models/* $MODELS_PATH

echo -e "-----FILES COPIED-----\n"
