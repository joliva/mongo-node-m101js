# Andrew Erlichson
# 10gen
# script to start a sharded environment on jomac.local

DB_ROOT="/data/sharded"

# clean everything up
echo "killing mongod and mongos"
killall mongod
killall mongos

echo "removing data files"
rm -r $DB_ROOT/config
rm -r $DB_ROOT/shard*


# start a replica set and tell it that it will be shard0
mkdir -p $DB_ROOT/shard0/rs0 $DB_ROOT/shard0/rs1 $DB_ROOT/shard0/rs2
mongod --replSet s0 --logpath "$DB_ROOT/s0-r0.log" --dbpath $DB_ROOT/shard0/rs0 --port 37017 --fork --shardsvr --smallfiles
mongod --replSet s0 --logpath "$DB_ROOT/s0-r1.log" --dbpath $DB_ROOT/shard0/rs1 --port 37018 --fork --shardsvr --smallfiles
mongod --replSet s0 --logpath "$DB_ROOT/s0-r2.log" --dbpath $DB_ROOT/shard0/rs2 --port 37019 --fork --shardsvr --smallfiles

sleep 5
# connect to one server and initiate the set
mongo --port 37017 << 'EOF'
config = { _id: "s0", members:[
          { _id : 0, host : "jomac.local:37017" },
          { _id : 1, host : "jomac.local:37018" },
          { _id : 2, host : "jomac.local:37019" }]};
rs.initiate(config)
EOF

# start a replicate set and tell it that it will be a shard1
mkdir -p $DB_ROOT/shard1/rs0 $DB_ROOT/shard1/rs1 $DB_ROOT/shard1/rs2
mongod --replSet s1 --logpath "$DB_ROOT/s1-r0.log" --dbpath $DB_ROOT/shard1/rs0 --port 47017 --fork --shardsvr --smallfiles
mongod --replSet s1 --logpath "$DB_ROOT/s1-r1.log" --dbpath $DB_ROOT/shard1/rs1 --port 47018 --fork --shardsvr --smallfiles
mongod --replSet s1 --logpath "$DB_ROOT/s1-r2.log" --dbpath $DB_ROOT/shard1/rs2 --port 47019 --fork --shardsvr --smallfiles

sleep 5

mongo --port 47017 << 'EOF'
config = { _id: "s1", members:[
          { _id : 0, host : "jomac.local:47017" },
          { _id : 1, host : "jomac.local:47018" },
          { _id : 2, host : "jomac.local:47019" }]};
rs.initiate(config)
EOF

# start a replicate set and tell it that it will be a shard2
mkdir -p $DB_ROOT/shard2/rs0 $DB_ROOT/shard2/rs1 $DB_ROOT/shard2/rs2
mongod --replSet s2 --logpath "$DB_ROOT/s2-r0.log" --dbpath $DB_ROOT/shard2/rs0 --port 57017 --fork --shardsvr --smallfiles
mongod --replSet s2 --logpath "$DB_ROOT/s2-r1.log" --dbpath $DB_ROOT/shard2/rs1 --port 57018 --fork --shardsvr --smallfiles
mongod --replSet s2 --logpath "$DB_ROOT/s2-r2.log" --dbpath $DB_ROOT/shard2/rs2 --port 57019 --fork --shardsvr --smallfiles

sleep 5

mongo --port 57017 << 'EOF'
config = { _id: "s2", members:[
          { _id : 0, host : "jomac.local:57017" },
          { _id : 1, host : "jomac.local:57018" },
          { _id : 2, host : "jomac.local:57019" }]};
rs.initiate(config)
EOF


# now start 3 config servers
mkdir -p $DB_ROOT/config/config-a $DB_ROOT/config/config-b $DB_ROOT/config/config-c 
mongod --logpath "$DB_ROOT/cfg-a.log" --dbpath $DB_ROOT/config/config-a --port 57040 --fork --configsvr --smallfiles
mongod --logpath "$DB_ROOT/cfg-b.log" --dbpath $DB_ROOT/config/config-b --port 57041 --fork --configsvr --smallfiles
mongod --logpath "$DB_ROOT/cfg-c.log" --dbpath $DB_ROOT/config/config-c --port 57042 --fork --configsvr --smallfiles

sleep 5

# now start the mongos on a standard port
mongos --logpath "$DB_ROOT/mongos-1.log" --configdb jomac.local:57040,jomac.local:57041,jomac.local:57042 --fork

echo "Waiting 60 seconds for the replica sets to fully come online"
sleep 60
echo "Connnecting to mongos and enabling sharding"

# add shards and enable sharding on the test db
mongo  <<'EOF'
db.adminCommand( { addshard : "s0/"+"jomac.local:37017" } );
db.adminCommand( { addshard : "s1/"+"jomac.local:47017" } );
db.adminCommand( { addshard : "s2/"+"jomac.local:57017" } );
db.adminCommand({enableSharding: "test"})
db.adminCommand({shardCollection: "test.grades", key: {student_id:1}});
EOF


