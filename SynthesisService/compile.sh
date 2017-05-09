#!/bin/bash

cd $(dirname $0)
source ../env.opts

EXE_PATH="./$EXE_PATH/$SPEECH_SYNTHESIS_NAME"

npm install
enclose ./src/SynthesisService.js
cp ./src/SynthesisService $EXE_PATH/$SPEECH_SYNTHESIS_NAME
rm ./src/SynthesisService
