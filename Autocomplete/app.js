var http = require('http');

//create a server object:
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(req.url); //write a response to the client
  res.end(); //end the response
}).listen(8080); //the server object listens on port 8080


const request = require('request');

request('http://www.mocky.io/v2/5c05818c3300006f00e812c2', { json: true }, (err, res, body) => {
  if (err) { return console.log(err); }
  console.log(body.url);
  console.log(body.explanation);
});

const axios = require('axios');

axios.get('http://www.mocky.io/v2/5c05818c3300006f00e812c2')
  .then(response => {
    console.log(response.data.url);
    console.log(response.data.explanation);
  })
  .catch(error => {
    console.log(error);
  });

app.get('/autocomplete/:input', function(req, res) {
  var fs = require('fs');
  var request = require('request');
  request('http://www.mocky.io/v2/5c05818c3300006f00e812c2', function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    var parsedWeather = JSON.parse(body);
    var input = req.params.input;
    var db = JSON.parse(body);
    var cultivo = [];
    for (var i = 0; i < db.length; i++){
      cultivo.push(db[i].cultivo)l;
    }
    var stringSimilarity = require('string-similarity');
    var matches = stringSimilarity.findBestMatch(input, cultivo);
    res.send(matches);
    
});
  
});



var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
