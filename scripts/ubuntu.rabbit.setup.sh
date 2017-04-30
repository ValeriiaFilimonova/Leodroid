#!/bin/bash

# POCO setup
apt-get install -y libpoco-dev

# AMQP setup
git clone -b v2.6.0 https://github.com/CopernicaMarketingSoftware/AMQP-CPP
cd AMQP-CPP
make pure && make install
cd ../
rm -r AMQP-CPP

# Sound configuring
FILE_PATH="/etc/java-8-openjdk/sound.properties"
head -n -9 /etc/java-8-openjdk/sound.properties > /etc/java-8-openjdk/sound.properties
echo #javax.sound.sampled.Clip=org.classpath.icedtea.pulseaudio.PulseAudioMixerProvider >> $FILE_PATH
echo #javax.sound.sampled.Port=org.classpath.icedtea.pulseaudio.PulseAudioMixerProvider >> $FILE_PATH
echo #javax.sound.sampled.SourceDataLine=org.classpath.icedtea.pulseaudio.PulseAudioMixerProvider >> $FILE_PATH
echo #javax.sound.sampled.TargetDataLine=org.classpath.icedtea.pulseaudio.PulseAudioMixerProvider >> $FILE_PATH

echo javax.sound.sampled.Clip=com.sun.media.sound.DirectAudioDeviceProvider >> $FILE_PATH
echo javax.sound.sampled.Port=com.sun.media.sound.PortMixerProvider >> $FILE_PATH
echo javax.sound.sampled.SourceDataLine=com.sun.media.sound.DirectAudioDeviceProvider >> $FILE_PATH
echo javax.sound.sampled.TargetDataLine=com.sun.media.sound.DirectAudioDeviceProvider >> $FILE_PATH

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
