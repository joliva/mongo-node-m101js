DB_ROOT="/data"

# clean everything up
echo "killing mongod and mongos"
killall mongod
killall mongos

echo "removing data files"
rm -r $DB_ROOT/config
rm -r $DB_ROOT/shard*


# start a replica set 
mkdir -p $DB_ROOT/rs1 $DB_ROOT/rs2 $DB_ROOT/rs3
mongod --replSet m101 --logpath "$DB_ROOT/1.log" --dbpath $DB_ROOT/rs1 --port 27017 --fork --smallfiles --oplogSize 64
mongod --replSet m101 --logpath "$DB_ROOT/2.log" --dbpath $DB_ROOT/rs2 --port 27018 --fork --smallfiles --oplogSize 64
mongod --replSet m101 --logpath "$DB_ROOT/3.log" --dbpath $DB_ROOT/rs3 --port 27019 --fork --smallfiles --oplogSize 64

sleep 5

# connect to one server and initiate the set
mongo --port 27017 << 'EOF'
config = { _id: "m101", members:[
          { _id : 0, host : "jomac.local:27017" },
          { _id : 1, host : "jomac.local:27018" },
          { _id : 2, host : "jomac.local:27019" }]};
rs.initiate(config)
EOF

