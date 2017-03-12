#!/bin/bash

cd $(dirname $0)

# Compiling executable

SERVICE_NAME="SpeechSynthesisService"

cd ../bin/$SERVICE_NAME

cmake ../../$SERVICE_NAME
make
cp $SERVICE_NAME ../../service/$SERVICE_NAME

#g++ -std=c++11 -o SpeechSynthesisService -I/espeak.h -lamqpcpp -lPocoNet -lPocoFoundation src/*
