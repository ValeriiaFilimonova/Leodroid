#!/bin/bash

echo -e "-----STARTED INSTALLATION-----\n"

echo "src/gz all-2 http://repo.opkg.net/edison/repo/all" >> /etc/opkg/base-feed.conf
echo "src/gz edison http://repo.opkg.net/edison/repo/edison" >> /etc/opkg/base-feed.conf
echo "src/gz core2-32 http://repo.opkg.net/edison/repo/core2-32" >> /etc/opkg/base-feed.conf

opkg update #10Mb
echo -e "\tOPKG updated"

opkg install upm #11Mb

# Espeak setup
opkg install espeak #5Mb
echo -e "\teSpeak installed"

# Alsa setup
opkg install alsa-utils #2Mb
touch /etc/asound.conf
echo "pcm.!default sysdefault:Device" >> /etc/asound.conf
echo -e "\tAlsa configured"

# Java and NPM configuration
ln -s /usr/lib/jvm/java-8-openjdk/bin/jar /usr/bin/jar
cd /home/root && npm install enclose
ln -s /home/root/node_modules/enclose/bin/enclose.js /usr/bin/enclose
echo -e "\tCompilers installed"

# Leodroid Project
git clone https://github.com/ValeriiaFilimonova/Leodroid -b dev-2.0
#wget https://github.com/ValeriiaFilimonova/Leodroid/archive/dev-2.0.zip
mv /home/root/Leodroid /home/root/src
echo -e "\tSources copies"

# systemd services setup
cd src
sh compile.sh
sh systemd.sh
sh copy.sh

systemctl daemon-reload
echo -e "\n-----INSTALLATION FINISHED-----\n"
