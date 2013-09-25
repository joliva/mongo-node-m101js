var express = require('express');

module.exports = function (app) {
  app.use(express.logger('dev'));

  // this is good enough for now but you'll
  // want to use connect-mongo or similar
  // for persistant sessions
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'building a blog' }));
  app.use(express.bodyParser());

  // expose session to views
  app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
  })
}
