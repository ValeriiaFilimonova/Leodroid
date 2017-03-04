#!/bin/bash

cd $(dirname $0)

# Compiling jar

LIB_PATH="../lib/"
LIB_NAMES=("amqp-client-4.0.2.jar" "slf4j-api-1.7.21.jar" "sphinx4-core-1.0.0.jar")

SERVICE_NAME="SpeechRecognitionService"

LIBRARIES=""

for (( i = 0; i < ${#LIB_NAMES[@]}; i++ ));
do
    if [[ $i -ne 0 ]]
    then
        LIBRARIES="${LIBRARIES}:"
    fi

    LIBRARIES="${LIBRARIES}${LIB_PATH}${LIB_NAMES[$i]}"
done

javac -cp $LIBRARIES -d ../bin/$SERVICE_NAME src/*.java
jar cvf $SERVICE_NAME.jar -C ../bin/$SERVICE_NAME/ .
#java -cp $LIBRARIES:$SERVICE_NAME.jar RecognitionService