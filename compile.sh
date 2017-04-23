#!/bin/bash

cd $(dirname $0)
source env.opts

COMPILE_FILE="compile.sh"
DIRECTORIES=($SPEECH_RECOGNITION_NAME $SPEECH_SYNTHESIS_NAME $DATA_STORAGE_NAME $APPLICATION_MANAGING_NAME)

for directory in "${DIRECTORIES[@]}"
do
    mkdir "exe/$directory"
    /bin/bash $directory/$COMPILE_FILE
done
