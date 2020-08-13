# vpp
虚拟电厂参赛项目


部署文档
# 一 安装docker
mac环境下
https://docs.docker.com/docker-for-mac/install/

ubuntu环境下
https://docs.docker.com/engine/install/ubuntu/

# 二 安装docker-compose
 curl -L https://get.daocloud.io/docker/compose/releases/download/1.26.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose

chmod +x /usr/local/bin/docker-compose

三 编译镜像
cd substrate-node-vpp
docker build -t develop/vpp-node:release .

cd ..

cd substrate-front-end-vpp
docker build -t develop/vpp-front:release .



四 启动服务
cd ..
./up.sh


五 关闭服务
./down.sh