#!/bin/bash

cd $(dirname $0)
source ../env.opts

EXE_PATH="./$EXE_PATH/$SPEECH_SYNTHESIS_NAME"

if [ ! -d "$EXE_PATH" ]
then
    mkdir -p $EXE_PATH
fi

enclose ./src/SynthesisService.js
cp src/SynthesisService $EXE_PATH/$SPEECH_SYNTHESIS_NAME
rm src/SynthesisService
