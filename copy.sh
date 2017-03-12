#!/bin/bash

cd $(dirname $0)
source env.opts

# copy folders with dependencies and services

if [ -d "$LIB_PATH" ];
then
    rm -r $LIB_PATH
fi
if [ -d "$SERVICES_PATH" ];
then
    rm -r $SERVICES_PATH
fi

cp -r lib $LIB_PATH
cp -r service $SERVICES_PATH

# copy sphinx models directory if not exists
if [ ! -d "$SERVICES_PATH/models" ]
then
    cp -r SpeechRecognitionService/src/models $SERVICES_PATH
fi

echo "files copied"
