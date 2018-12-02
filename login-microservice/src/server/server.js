const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const helmet = require('helmet');
const passport = require('../config/passport');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');

var server = null;
function start(api, repository, callback){
    const app = express();

    app.use(morgan('dev'));
    app.use(helmet());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    require('../models/user');

    app.use(session({ secret: 'passport-tutorial', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

    app.use((err, req, res, next) => {
      callback(new Error('Something went wrong!, err:' + err), null);
      res.status(500).send('Something went wrong!');
    })
    api(app, repository);
    server = app.listen(parseInt(process.env.PORT), () =>
callback(null, server));
}
function stop(){
  if(server) server.close();
  return true;
}

module.exports = { start, stop }