opkg install upm

# Espeak setup
opkg install espeak

# Java and NPM configuration
ln -s /usr/lib/jvm/java-8-openjdk/bin/jar /usr/bin/jar
npm install -g npm enclose

# RabbitMQ and Erlang setup
cd /home/root
mkdir RabbitMQ && cd RabbitMQ
wget http://www.erlang.org/download/otp_src_R16B.tar.gz
tar xvf /home/root/RabbitMQ/otp_src_R16B.tar.gz
cd otp_src_R16B
export LANG=C
./configure && make && make install

cd /home/root/RabbitMQ
wget http://www.rabbitmq.com/releases/rabbitmq-server/v3.0.4/rabbitmq-server-generic-unix-3.0.4.tar.gz
tar xvf rabbitmq-server-generic-unix-3.0.4.tar.gz
ln -s /home/root/RabbitMQ/rabbitmq_server-3.0.4/sbin/rabbitmq-server /usr/bin/rabbitmq-server
ln -s /home/root/RabbitMQ/rabbitmq_server-3.0.4/sbin/rabbitmq-env /usr/bin/rabbitmq-env
ln -s /home/root/RabbitMQ/rabbitmq_server-3.0.4/sbin/rabbitmqctl /usr/bin/rabbitmqctl

rm -r otp_src_R16B
rm otp_src_R16B.tar.gz && rm rabbitmq-server-generic-unix-3.0.4.tar.gz

echo "RabbitMQ installed"

# Poco setup
cd /home/root
mkdir Poco && cd Poco
wget https://pocoproject.org/releases/poco-1.7.8/poco-1.7.8p2.tar.gz
tar xvf /home/root/Poco/poco-1.7.8p2.tar.gz
cd poco-1.7.8p2
./configure && make && make install

cd /home/root
rm /Poco/poco-1.7.8p2.tar.gz && rm -r /Poco/poco-1.7.8p2
echo "Poco installed"

# AMQP setup
cd /home/root
git clone -b v2.6.0 https://github.com/CopernicaMarketingSoftware/AMQP-CPP
cd AMQP-CPP
make pure && make install

cd /home/root
rm -r AMQP-CPP

echo "AMQP installed"

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