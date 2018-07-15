#!/usr/bin/env node
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//get
var getPlayList = require('./routes/get/getPlayList');
var getStartTrack = require('./routes/get/getStartTrack');
var getSpotifyToken = require('./routes/get/getSpotifyToken');

//set
var setPlayList = require('./routes/set/setPlayList');
var setStartTrack = require('./routes/set/setStartTrack');

//check
var checkPlaylist = require('./routes/check/checkPlaylist');

//delete
var deleteTrack = require('./routes/delete/deleteTrack');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Add headers
app.use(function (req, res, next) {


    // Website you wish to allow to connect
    var allowedOrigins = ['http://127.0.0.1', 'http://localhost:4200', 'https://just-bedarf.de'];
    var origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
         res.setHeader('Access-Control-Allow-Origin', origin);
    }

    // Request methods you wish to allow (POST, OPTIONS, PUT, PATCH, DELETE)
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
//get
app.use('/getPlayList', getPlayList);
app.use('/getStartTrack', getStartTrack);
app.use('/getSpotifyToken', getSpotifyToken);

//set
app.use('/setPlayList', setPlayList);
app.use('/setStartTrack', setStartTrack);

//check
app.use('/checkPlaylist', checkPlaylist);

//delete
app.use('/deleteTrack', deleteTrack);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
