var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

//MongoBD Database
///////////////////////////////////////////////
mongoose.connect('mongodb://localhost/Blogs');

var BlogsSchema = new mongoose.Schema({
  author: String,
  url: String,
  title: String,
  updated_at: { type: Date, default: Date.now },
});

var Blogs = mongoose.model('Blogs', BlogsSchema);
///////////////////////////////////////////////

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(function (req, res, next) {//Show ip users
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log('Client IP:', ip);
  next();
});
app.use('/api/blogs/:id', function (req, res, next) {//Show method users
  console.log('Client request type:', req.method);
  next();
});
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);


//API
///////////////////////////////////////////////
app.get('/api/blogs', function(req, res, next) {
  Blogs.find(function (err, blogs) {
    if (err) return next(err);
    res.json(blogs);
  });
});
app.post('/api/blogs', function(req, res, next) {
  Blogs.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});
app.get('/api/blogs/:id', function(req, res, next) {
  Blogs.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});
app.put('/api/blogs/:id', function(req, res, next) {
  Blogs.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});
app.delete('/api/blogs/:id', function(req, res, next) {
  Blogs.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});
//////////////////////////////////////////////////

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
