#!/bin/bash

cd $(dirname $0)

# Node JS setup

if [ "$(node -v)" == *"v4."* ]
then
    sudo apt-get install -y nodejs
fi
echo "node-js installed"

# NPM setup

if [ "$(npm -v)" == *"4."* ]
then
    sudo apt-get install -y npm
fi
echo "npm installed"

# RabbitMQ setup

if [ -z "$(sudo apt-cache policy rabbitmq-server | grep 'Installed: 3.')" ]
then
    sudo apt-get install -y rabbitmq-server
fi
echo "rabbitmq installed"

if [ -z "$(sudo rabbitmqctl status | grep 'rabbit')" ]
then
    rabbitmq-server
fi
echo "rabbitmq daemon started"

# eSpeak setup

if [ -z "$(espeak --version | grep 'eSpeak text-to-speech')" ]
then
    sudo apt-get install -y espeak
fi
echo "eSpeak installed"
