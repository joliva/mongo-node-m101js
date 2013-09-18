#!/bin/bash
mkdir -p /data/dbs/rs1 /data/dbs/rs2 /data/dbs/rs3
mongod --replSet m101 --logpath "/data/dbs/1.log" --dbpath /data/dbs/rs1 --port 27017 --smallfiles --fork
mongod --replSet m101 --logpath "/data/dbs/2.log" --dbpath /data/dbs/rs2 --port 27018 --smallfiles --fork
mongod --replSet m101 --logpath "/data/dbs/3.log" --dbpath /data/dbs/rs3 --port 27019 --smallfiles --fork
