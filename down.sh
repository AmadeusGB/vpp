#!/bin/sh
docker-compose -f ./substrate-front-end-vpp/docker-compose.yml down -v
docker-compose -f ./substrate-node-vpp/docker-compose.yml down -v