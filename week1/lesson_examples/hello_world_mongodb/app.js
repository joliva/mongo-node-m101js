var MongoClient = require('mongodb').MongoClient;
//var Server = require('mongodb').Server;

// Examples of two different ways to connect to mongodb
//var mongoclient = new MongoClient(new Server("localhost", 27017, {native_parser: true}));

//mongoclient.open(function(err, mongoclient) {
//    console.log("Open!");
//});
//

// Open the connection to the server
MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
//MongoClient.connect('mongodb://localhost:27017/test', function(err, db) {

    if(err) throw err;

    // Find one document in our collection
    db.collection('coll').findOne({}, function(err, doc) {

        if(err) throw err;

        // Print the result. Will print a null if there are no documents in the db.
        console.dir(doc);

        // Close the DB
        db.close();
    });

    // Declare success
    console.dir("Called findOne!");
});
