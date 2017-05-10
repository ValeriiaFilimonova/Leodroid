#!/bin/bash

cd $(dirname $0)
source ./env.opts

echo -e "-----STARTED COMPILING-----\n"

COMPILE_FILE="compile.sh"
DIRECTORIES=($SPEECH_RECOGNITION_NAME $SPEECH_SYNTHESIS_NAME $DATA_STORAGE_NAME $APPLICATION_MANAGING_NAME $MAINTENANCE_NAME $MOVING_NAME)

for directory in "${DIRECTORIES[@]}"
do
    mkdir -p "./exe/$directory"
    /bin/bash $directory/$COMPILE_FILE

    echo -e "\n-----$directory COMPILED-----\n"
done
