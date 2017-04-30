#!/bin/bash

cd $(dirname $0)
source ../env.opts

# Compiling jar

JAR_NAME="message-bus-1.0.0"

LIBRARIES="${LIB_PATH}/amqp-client-4.0.2.jar:${LIB_PATH}/slf4j-api-1.7.24.jar:${LIB_PATH}/slf4j-simple-1.7.24.jar"
BIN_PATH="temp"

mkdir $BIN_PATH

javac -cp $LIBRARIES -d $BIN_PATH message/bus/*.java
jar cvf $LIB_PATH/$JAR_NAME.jar -C $BIN_PATH/ .

rm -r $BIN_PATH
