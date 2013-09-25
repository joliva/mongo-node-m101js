var loggedIn = require('../middleware/loggedIn');
var mongoose = require('mongoose')
var BlogPost = mongoose.model('BlogPost');
var Comment = mongoose.model('Comment');

module.exports = function (app) {
  // create
  app.get("/post/create", loggedIn, function (req, res) {
    res.render('post/create.jade');
  })

  app.post("/post/create", loggedIn, function (req, res, next) {
    var body = req.param('body');
    var title = req.param('title');
    var user = req.session.user;

    BlogPost.create({
        body: body
      , title: title
      , author: user
     }, function (err, post) {
       if (err) return next(err);
       res.redirect('/post/' + post.id);
    });

    // notify twitter that we published a new post using model hook

  })


  // read
  app.get("/post/:id", function (req, res, next) {
    var id = req.param('id');

    var promise = BlogPost.findComments(id)
                          .sort('created')
                          .select('-_id') // exclude the _id
                          .exec();

    var query = BlogPost.findById(id).populate('author');
    query.exec(function (err, post) {
      if (err) return next(err);

      if (!post) return next(); // 404

      res.render('post/view.jade', { post: post, comments: promise });
    })
  })




  // update
  app.get("/post/edit/:id", loggedIn, function (req, res, next) {
    res.render('post/create.jade', {
      post: BlogPost.findById(req.param('id'))
    });
  })

  app.post("/post/edit/:id", loggedIn, function (req, res, next) {
    BlogPost.edit(req, function (err) {
      if (err) return next(err);
      res.redirect("/post/" + req.param('id'));
    })
  })

  // delete
  app.get("/post/remove/:id", loggedIn, function (req, res, next) {
    var id = req.param('id');

    BlogPost.findOne({ _id: id }, function (err, post) {
      if (err) return next(err);

      // validate logged in user authored this post
      if (post.author != req.session.user) {
        return res.send(403);
      }

      post.remove(function (err) {
        if (err) return next(err);

        // TODO display a confirmation msg to user
        res.redirect('/');
      })
    })
  })

  // comments
  app.post("/post/comment/:id", loggedIn, function (req, res, next) {
    var id = req.param('id');
    var text = req.param('text');
    var author = req.session.user;

    Comment.create({
        post: id
      , text: text
      , author: author
     }, function (err, comment) {
      if (err) return next(err);

      // TODO probably want to do this all with with xhr
      res.redirect("/post/" + id);
    });
  });
}
