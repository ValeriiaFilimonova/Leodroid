#!/bin/bash

cd $(dirname $0)

# RabbitMQ setup

if [ -z "$(apt-cache policy rabbitmq-server | grep 'Installed: 3.')" ]
then
    apt-get install -y rabbitmq-server
fi
echo "rabbitmq installed"

if [ -z "$(rabbitmqctl status | grep 'rabbit')" ]
then
    rabbitmq-server
fi
echo "rabbitmq daemon started"

# eSpeak setup

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

./copy.sh
./systemd.sh
