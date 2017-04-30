#!/bin/bash

cd $(dirname $0)

# Espeak setup

if [ -z "$(espeak --version | grep 'eSpeak text-to-speech')" ]
then
    apt-get install -y espeak
fi
echo "eSpeak installed"

# Redis setup

if [ -z "$(redis-cli -v | grep '3.')" ]
then
    apt-get install -y redis-server
fi
echo "redis installed"

# systemd services setup
./compile.sh
./systemd.sh
./copy.sh

systemctl daemon-reload
echo "services enabled"
