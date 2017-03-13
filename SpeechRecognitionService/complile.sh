#!/bin/bash

cd $(dirname $0)

# Compiling jar


LIB_PATH="../lib"
LIBRARIES="${LIB_PATH}/amqp-client-4.0.2.jar:${LIB_PATH}/slf4j-api-1.7.21.jar"
SERVICE_NAME="SpeechRecognitionService"

javac -cp $LIBRARIES:$LIB_PATH/$SERVICE_NAME/* -d ../bin/$SERVICE_NAME src/*.java
jar cvf ../service/$SERVICE_NAME.jar -C ../bin/$SERVICE_NAME/ .
