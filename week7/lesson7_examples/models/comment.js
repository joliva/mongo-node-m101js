
// Comment model

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var createdDate = require('../plugins/createdDate');

var schema = mongoose.Schema({
    text: { type: String, trim: true, validate: validateText }
  , post: { type: ObjectId, index: true }
  , author: String
})

function validateText (str) {
  return str.length < 250;
}

// in production we disable auto index creation
// schema.set('autoIndex', false);

// add created date property
schema.plugin(createdDate);

module.exports = mongoose.model('Comment', schema);
