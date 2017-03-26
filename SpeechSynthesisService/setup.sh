#!bin/bash

# AMQP-CPP install

git clone https://github.com/CopernicaMarketingSoftware/AMQP-CPP
cd AMQP-CPP
make pure
make install
cd ../
rm -r AMQP-CPP

# POCO install
apt-get install cmake libpoco-dev

# In file /etc/java-8-openjdk/sound.properties comment PulseAudio settings and uncomment DirectAudioProvider if LineUnavailable error
