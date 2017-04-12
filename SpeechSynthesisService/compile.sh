#!/bin/bash

cd $(dirname $0)
source ../env.opts

# Compiling executable

SERVICE_NAME=$SPEECH_SYNTHESIS_NAME
BIN_PATH="$BIN_PATH/$SERVICE_NAME"

if [ ! -d "$BIN_PATH" ]
then
    mkdir $BIN_PATH
fi

cd $BIN_PATH

cmake ../../$SERVICE_NAME
make
cp $SERVICE_NAME ../$EXE_PATH/$SERVICE_NAME

#g++ -std=c++11 -o SpeechSynthesisService -I/espeak.h -lamqpcpp -lPocoNet -lPocoFoundation src/*
