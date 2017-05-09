#!/bin/bash

cd $(dirname $0)
source ../env.opts

SERVICE_NAME="MovingService"
EXE_PATH="./$EXE_PATH/$SERVICE_NAME"
BIN_PATH="$BIN_PATH/$SERVICE_NAME"

LIBRARIES="${LIB_PATH}/slf4j-api-1.7.24.jar:${LIB_PATH}/slf4j-simple-1.7.24.jar"
LIBRARIES="${LIBRARIES}:${LIB_PATH}/$SERVICE_NAME/*"

mkdir -p $BIN_PATH
javac -cp "$LIBRARIES" -d $BIN_PATH src/*.java
jar cvf $EXE_PATH/$SERVICE_NAME.jar -C $BIN_PATH/ .

