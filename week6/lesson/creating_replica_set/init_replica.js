config = { _id: "m101", members:[
          { _id : 0, host : "jomac.local:27017"},
          { _id : 1, host : "jomac.local:27018"},
          { _id : 2, host : "jomac.local:27019"} ]
};

rs.initiate(config);
rs.status();



