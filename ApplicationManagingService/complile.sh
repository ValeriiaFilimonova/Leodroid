#!/bin/bash

cd $(dirname $0)

# Compiling jar

SERVICE_NAME="ApplicationManagingService"

LIB_PATH="../lib"
LIBRARIES="${LIB_PATH}/amqp-client-4.0.2.jar:${LIB_PATH}/slf4j-api-1.7.24.jar:${LIB_PATH}/slf4j-simple-1.7.24.jar"
BIN_PATH="../bin/$SERVICE_NAME"

if [ ! -d "$BIN_PATH" ]
then
    mkdir $BIN_PATH
fi

javac -cp $LIBRARIES:$LIB_PATH/$SERVICE_NAME/* -d $BIN_PATH src/*/*.java src/*.java
jar cvf ../service/$SERVICE_NAME.jar -C $BIN_PATH/ .
