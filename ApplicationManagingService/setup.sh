#!bin/bash

# Allows to run systemctl without password

echo "%sudo	ALL=(ALL:ALL) NOPASSWD: /bin/systemctl\n" >> /etc/sudoers
