var client = require('mongodb').MongoClient;

client.connect('mongodb://localhost:27017/photos', function(err, db) {
	if (err) throw err;

	/*
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
	*/

	/*
	db.collection('messages', function(err, collection) {
		if (err) throw err;

		collection.aggregate(pipeline, function(err, result) {
			console.dir(result);

			// close DB after results from all queries are complete
			count--;
			if (count == 0) db.close()
		});
	});
	*/

	var albums = db.collection('albums');

	db.collection('images', function(err, images) {
		if (err) throw err;

		images.find({}, {'_id':true}, function(err, cursor) {
			if (err) throw err;

			var count = cursor.count(function(err, count) {
				console.dir('num images: ' + count);

				// iterate over each image
				cursor.each(function(err, item) {
					if (item !== null) {
						// attempt to find an album containing the photo, if not prune
						albums.findOne({images:item._id}, function(err, doc) {
							if (err) throw err;
	
							if (doc == null) {
								images.remove({'_id':item._id}, function(err, numRemoved) {
									if (err) throw err;
	
									count--;
									console.dir('count: ' + count);
									if (count == 0) db.close();
								});
							} else {
								count--;
								console.dir('count: ' + count);
								if (count == 0) db.close();
							}
						});
					}	
				});
			});
		})
	});

});


