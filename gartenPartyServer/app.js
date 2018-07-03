var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//get
var getPlayList = require('./routes/get/getPlayList');
var getStartTrack = require('./routes/get/getStartTrack');

//set
var setPlayList = require('./routes/set/setPlayList');
var setStartTrack = require('./routes/set/setStartTrack');

//check
var checkPartys = require('./routes/check/checkPartys');


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
    var allowedOrigins = ['http://127.0.0.1:4200', 'http://localhost:4200', 'http://192.168.0.31:4200', 'http://localhost:3000', 'http://just-bedarf.de', 'http://just-bedarf.tk', 'http://31.214.243.127:4200'];
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

//set
app.use('/setPlayList', setPlayList);
app.use('/setStartTrack', setStartTrack);

//check
app.use('/checkPartys', checkPartys);

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
