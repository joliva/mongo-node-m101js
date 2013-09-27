var client = require('mongodb').MongoClient;

var pairs = [
	{from:'susan.mara@enron.com', to:'jeff.dasovich@enron.com'},
	{from:'susan.mara@enron.com', to:'richard.shapiro@enron.com'},
	{from:'soblander@carrfut.com', to:'soblander@carrfut.com'},
	{from:'susan.mara@enron.com', to:'james.steffes@enron.com'},
	{from:'evelyn.metoyer@enron.com', to:'kate.symes@enron.com'},
	{from:'susan.mara@enron.com', to:'alan.comnes@enron.com'}
];

client.connect('mongodb://localhost:27017/enron', function(err, db) {
	if (err) throw err;

	var count = pairs.length;	// # of pairs to run aggregate query over

	pairs.forEach(function(pair, index, array) {
		var pipeline = [
			{$project:{'headers.From':1, 'headers.To':1}},
			{$match:{'headers.From': pair.from}},
			{$unwind:'$headers.To'},
			{$match:{'headers.To': pair.to}},
			{$group:{
				//_id:{id: '$_id', from:'$headers.From'}, 
				_id:{id: '$_id', from:'$headers.From'}, 
				to:{$addToSet: '$headers.To'}
			}},
			{$unwind:'$to'},
			{$group:{
				_id:{from:'$_id.from', to:'$to'},
				count: {$sum: 1}
			}},
		];

		db.collection('messages', function(err, collection) {
			if (err) throw err;
	
			collection.aggregate(pipeline, function(err, result) {
				console.dir(result);

				// close DB after results from all queries are complete
				count--;
				if (count == 0) db.close()
			});
		});
	});
});


