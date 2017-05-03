#!/bin/bash

echo -e "-----STARTED INSTALLATION-----\n"

echo "src/gz all-2 http://repo.opkg.net/edison/repo/all" >> /etc/opkg/base-feed.conf
echo "src/gz edison http://repo.opkg.net/edison/repo/edison" >> /etc/opkg/base-feed.conf
echo "src/gz core2-32 http://repo.opkg.net/edison/repo/core2-32" >> /etc/opkg/base-feed.conf

opkg update #10Mb
echo -e "\tOPKG updated"

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
npm install -g enclose
echo -e "\tCompilers installed"

# Leodroid Project
mkdir -p /home/root/src
cd /home/root/src
git clone https://github.com/ValeriiaFilimonova/Leodroid -b prod
echo -e "\tSources copies"

# systemd services setup
cd Leodroid
sh compile.sh
sh systemd.sh
sh copy.sh

systemctl daemon-reload
echo -e "\n-----INSTALLATION FINISHED-----\n"
