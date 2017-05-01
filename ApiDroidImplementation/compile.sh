#!/bin/bash

cd $(dirname $0)
source ../env.opts

# Compiling jar

JAR_NAME="droid-api-1.0.0"

LIBRARIES="${LIB_PATH}/jedis-2.9.0.jar:${LIB_PATH}/commons-pool2-2.4.2.jar"

BIN_PATH="temp"
mkdir $BIN_PATH

javac -cp $LIBRARIES -d $BIN_PATH droid/api/*.java
jar cvf $LIB_PATH/$JAR_NAME.jar -C $BIN_PATH/ .

rm -r $BIN_PATH
