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
