# 0、Project Name
基于区块链的虚拟电厂设计与实现（Design and implementation of virtual power plant based on blockchain）

# 1、Project Description
This project is a virtual energy resource trading system based on blockchain technology, which aggregates scattered and intermittent distributed power generation units (usually new energy) and distributed energy storage units distributed around the world to provide energy trading services as a whole. Through our design plan, we provide an energy trading solution for residential, commercial and industrial areas. Promote the orderly development and credible transactions of new energy around the world, and help the power grid gain stronger stability and provide better services.

# 2、install docker
mac环境下
https://docs.docker.com/docker-for-mac/install/

ubuntu环境下
https://docs.docker.com/engine/install/ubuntu/

# 3、install docker-compose
 curl -L https://get.daocloud.io/docker/compose/releases/download/1.26.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose

chmod +x /usr/local/bin/docker-compose

# 4、Compile image
cd substrate-node-vpp
docker build -t develop/vpp-node:release .

cd ..

cd substrate-front-end-vpp
docker build -t develop/vpp-front:release .



# 5、Start service
cd ..
./up.sh


# 6、Close service
./down.sh
