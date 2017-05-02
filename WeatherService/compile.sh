#!/bin/bash

cd $(dirname $0)
source ../env.opts

# Compiling jar

SERVICE_NAME="WeatherService"

LIBRARIES="${LIB_PATH}/jedis-2.9.0.jar:${LIB_PATH}/commons-pool2-2.4.2.jar:${LIB_PATH}/droid-api-1.0.0.jar"
LIBRARIES="${LIBRARIES}:${LIB_PATH}/slf4j-api-1.7.24.jar:${LIB_PATH}/slf4j-simple-1.7.24.jar"
BIN_PATH="$BIN_PATH/$SERVICE_NAME"

if [ ! -d "$BIN_PATH" ]
then
    mkdir -p $BIN_PATH
fi

javac -cp $LIBRARIES:$LIB_PATH/$SERVICE_NAME/* -d $BIN_PATH src/*.java
jar cvf $SERVICE_NAME.jar -C $BIN_PATH/ .
