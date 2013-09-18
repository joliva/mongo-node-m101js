var MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017,localhost:27018,localhost:27019/course?w=1", function(err, db) {
    if (err) throw err;

    // Write concern of one
    db.collection("repl").insert({ 'x' : 1 }, function(err, doc) {
        if (err) throw err;
        console.log(doc);

        // Write concern of two
        db.collection("repl").insert({ 'x' : 2 }, { 'w' : 2 }, function(err, doc) {
            if (err) throw err;
            console.log(doc);
            db.close();
        });

        // Write concern of four - callback won't be called indefinitely with a write concern greater
		  // than the number of nodes in the replica set.
        db.collection("repl").insert({ 'x' : 2 }, { 'w' : 4 }, function(err, doc) {
            if (err) throw err;
            console.log(doc);
            db.close();
        });
    });
});
