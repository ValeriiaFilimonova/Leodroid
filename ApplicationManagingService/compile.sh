#!/bin/bash

cd $(dirname $0)
source ../env.opts

# Compiling jar

SERVICE_NAME=$APPLICATION_MANAGING_NAME

LIBRARIES="${LIB_PATH}/amqp-client-4.0.2.jar:${LIB_PATH}/slf4j-api-1.7.24.jar:${LIB_PATH}/slf4j-simple-1.7.24.jar:${LIB_PATH}/message-bus-1.0.0.jar}"
BIN_PATH="$BIN_PATH/$SERVICE_NAME"

if [ ! -d "$BIN_PATH" ]
then
    mkdir $BIN_PATH
fi

javac -cp $LIBRARIES:$LIB_PATH/$SERVICE_NAME/* -d $BIN_PATH src/*/*.java src/*.java
jar cvf $EXE_PATH/$SERVICE_NAME/$SERVICE_NAME.jar -C $BIN_PATH/ .
