var	client = require('mongodb').MongoClient,
		_ = require('underscore');

// parameters:
// 	arry - array of student scores
// returns: array with lowest homework score dropped
var dropLowestHomeworkScore = function(arry) {
	var minVal = Number.MAX_VALUE;
	var minIdx = -1;
	var newArray = [];

	for (i=0; i<arry.length; i++) {
		var val = arry[i]['score'];
		var type = arry[i]['type'];
		if (type === 'homework' && val < minVal) {
			minVal = val;
			minIdx = i;
		}
	}

	for (i=0; i<arry.length; i++) {
		if (i !== minIdx) newArray.push(arry[i]);
	}

	return newArray;
};

var db = client.connect('mongodb://localhost:27017/school', function(err,db) {
	if (err) throw err;

	var students = db.collection('students');

	students.find({}).toArray(function(err, docs) {
		if (err) throw err;

		// update each doc by removing lowest score 
		_.each(docs, function(doc) {
			doc.scores = dropLowestHomeworkScore(doc.scores);
			students.update({'_id':doc._id}, doc, {}, function(err, result) {
				if (err) throw err;
			});
		});

		db.close()
	});
});

