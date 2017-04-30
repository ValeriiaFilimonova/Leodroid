#!bin/bash

# AMQP-CPP install
git clone -b v2.6.0 https://github.com/CopernicaMarketingSoftware/AMQP-CPP
cd AMQP-CPP
make pure && make install
cd ../
rm -r AMQP-CPP

# In file /etc/java-8-openjdk/sound.properties comment PulseAudio settings and uncomment DirectAudioProvider if LineUnavailable error

#Uncomment for Yocto
FILE_PATH="/usr/lib/jvm/java-8-openjdk/jre/lib/sound.properties"

#Uncomment for Ubuntu
#FILE_PATH="/etc/java-8-openjdk/sound.properties"
#head -n -9 /etc/java-8-openjdk/sound.properties > /etc/java-8-openjdk/sound.properties
#echo #javax.sound.sampled.Clip=org.classpath.icedtea.pulseaudio.PulseAudioMixerProvider >> $FILE_PATH
#echo #javax.sound.sampled.Port=org.classpath.icedtea.pulseaudio.PulseAudioMixerProvider >> $FILE_PATH
#echo #javax.sound.sampled.SourceDataLine=org.classpath.icedtea.pulseaudio.PulseAudioMixerProvider >> $FILE_PATH
#echo #javax.sound.sampled.TargetDataLine=org.classpath.icedtea.pulseaudio.PulseAudioMixerProvider >> $FILE_PATH

echo javax.sound.sampled.Clip=com.sun.media.sound.DirectAudioDeviceProvider >> $FILE_PATH
echo javax.sound.sampled.Port=com.sun.media.sound.PortMixerProvider >> $FILE_PATH
echo javax.sound.sampled.SourceDataLine=com.sun.media.sound.DirectAudioDeviceProvider >> $FILE_PATH
echo javax.sound.sampled.TargetDataLine=com.sun.media.sound.DirectAudioDeviceProvider >> $FILE_PATH
