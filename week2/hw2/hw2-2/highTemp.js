var client = require('mongodb').MongoClient;

client.connect('mongodb://localhost:27017/weather', function(err, db) {
	if (err) throw err;

	var query = {};
	var projection = {'State':1, 'Temperature':1};

	var cursor = db.collection('data').find(query, projection);

	// Sort by state and then by temperature (decreasing)
	cursor.sort([['State',1], ['Temperature',-1]]);

	var state = '';	// initialize to dummy value
	var operator = {'$set':{'month_high':true}};

	cursor.each(function(err, doc) {
		if (err) throw err;

		if (doc == null) {
			return db.close();
		} else if (doc.State !== state) {
			// first record for each state is the high temp one
			state = doc.State;

			db.collection('data').update({'_id':doc._id}, operator, function(err, updated) {
				if (err) throw err;
			});
		}
	});
});
