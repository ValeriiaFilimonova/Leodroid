#!/bin/bash

cd $(dirname $0)
source ../env.opts

enclose ./src/SynthesisService.js
cp src/SynthesisService ./$EXE_PATH/$SPEECH_SYNTHESIS_NAME/$SPEECH_SYNTHESIS_NAME
rm src/SynthesisService
