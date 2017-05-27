#!/bin/bash

cd $(dirname $0)
source ../env.opts

JAR_NAME="droid-api-1.0.0"
BIN_PATH="$BIN_PATH/ApiDroidImplementation"
LIBRARIES="${LIB_PATH}/jedis-2.9.0.jar:${LIB_PATH}/commons-pool2-2.4.2.jar"

mkdir -p $BIN_PATH
javac -cp $LIBRARIES -d $BIN_PATH droid/api/*.java
jar cvf $LIB_PATH/$JAR_NAME.jar -C $BIN_PATH/ .
