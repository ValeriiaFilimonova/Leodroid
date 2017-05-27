#!/bin/bash

cd $(dirname $0)

echo -e "-----STARTED INSTALLATION-----\n"

# Espeak setup

if [ -z "$(espeak --version | grep 'eSpeak text-to-speech')" ]
then
    apt-get install -y espeak
fi
echo -e "\teSpeak installed"

# Redis setup

if [ -z "$(redis-cli -v | grep '3.')" ]
then
    apt-get install -y redis-server
fi
echo -e "\tredis installed"
echo

./compile.sh
./systemd.sh
./copy.sh

systemctl daemon-reload
systemctl start droid-system.target
echo -e "\n-----INSTALLATION FINISHED-----\n"
