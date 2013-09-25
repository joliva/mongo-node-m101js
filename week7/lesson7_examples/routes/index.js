var errors = require('./errors');
var login = require('./login');
var posts = require('./posts');
var mongoose = require('mongoose');
var BlogPost = mongoose.model('BlogPost');

module.exports = function (app) {

  // home page
  app.get('/', function (req, res, next) {
    BlogPost.find().sort('created').limit(10).exec(function (err, posts) {
      if (err) return next(err);
      res.render('home.jade', { posts: posts });
    })
  })

  // login / logout routes
  login(app);

  // blog post crud
  posts(app);

  // error handlers
  errors(app);
}
