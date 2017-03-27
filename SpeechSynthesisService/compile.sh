#!/bin/bash

cd $(dirname $0)

# Compiling executable

SERVICE_NAME="SpeechSynthesisService"
BIN_PATH="../bin/$SERVICE_NAME"

if [ ! -d "$BIN_PATH" ]
then
    mkdir $BIN_PATH
fi

cd $BIN_PATH

cmake ../../$SERVICE_NAME
make
cp $SERVICE_NAME ../../service/$SERVICE_NAME

#g++ -std=c++11 -o SpeechSynthesisService -I/espeak.h -lamqpcpp -lPocoNet -lPocoFoundation src/*
