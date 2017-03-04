#!bin/bash

# AMQP-CPP install

git clone https://github.com/CopernicaMarketingSoftware/AMQP-CPP
cd AMQP-CPP
make pure
sudo make install
cd ../
rm -r AMQP-CPP

# POCO install
sudo apt-get install cmake libpoco-dev
