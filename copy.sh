#!/bin/bash

cd $(dirname $0)

# copy folders with dependencies and services

export SERVICES_PATH="/usr/share/droid-system"
export LIB_PATH="/usr/lib/droid-system"

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
