#!/bin/bash

echo "src/gz all-2 http://repo.opkg.net/edison/repo/all" >> /etc/opkg/base-feed.conf
echo "src/gz edison http://repo.opkg.net/edison/repo/edison" >> /etc/opkg/base-feed.conf
echo "src/gz core2-32 http://repo.opkg.net/edison/repo/core2-32" >> /etc/opkg/base-feed.conf

opkg update #10Mb
#opkg install upm

# Espeak setup
opkg install espeak #5Mb

# Alsa setup
opkg install alsa-utils #2Mb
touch /etc/asound.conf
echo "pcm.!default sysdefault:Device" >> /etc/asound.conf

# Java and NPM configuration
ln -s /usr/lib/jvm/java-8-openjdk/bin/jar /usr/bin/jar
npm install -g enclose

# Leodroid Project
cd /home/root
git clone https://github.com/ValeriiaFilimonova/Leodroid -b prod

# systemd services setup
cd Leodroid
sh compile.sh
sh systemd.sh
sh copy.sh

systemctl daemon-reload
echo "services enabled"
