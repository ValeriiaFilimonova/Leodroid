#!/bin/bash

cd $(dirname $0)
source ../env.opts

# Compiling jar

SERVICE_NAME="WeatherService"
BIN_PATH="$BIN_PATH/$SERVICE_NAME"

LIBRARIES="${LIB_PATH}/jedis-2.9.0.jar:${LIB_PATH}/commons-pool2-2.4.2.jar:${LIB_PATH}/droid-api-1.0.0.jar"
LIBRARIES="${LIBRARIES}:${LIB_PATH}/slf4j-api-1.7.24.jar:${LIB_PATH}/slf4j-simple-1.7.24.jar"

mkdir -p $BIN_PATH
javac -cp $LIBRARIES:dependencies/* -d $BIN_PATH src/*.java
jar cvf $SERVICE_NAME.jar -C $BIN_PATH/ .

zip weather.zip ./dependencies/* ./config.json ./WeatherService.jar
