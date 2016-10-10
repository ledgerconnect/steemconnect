const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const http = require('http');
const https = require('https');
const cors = require('cors');
const hbs = require('hbs');
const helmet = require('helmet');
const csurf = require('csurf');
const { verifyToken } = require('./routes/middleware');
const steem = require('steem');

http.globalAgent.maxSockets = 100;
https.globalAgent.maxSockets = 100;

const app = express();

if (process.env.NODE_ENV !== 'production') {
  require('./webpack')(app); // eslint-disable-line
}

// view engine setup
hbs.registerPartials(path.join(__dirname, 'views/partials'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(helmet());
app.use(cookieParser());

if (process.env.NODE_ENV !== 'test') {
  app.use(logger(
    process.env.NODE_ENV === 'production'
    ? 'combined'
    : 'dev'
  ));
}

app.use(csurf({ cookie: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.use(cors({ credentials: true, origin: true }));
app.use(verifyToken);
const debug = require('debug')('steemconnect:main');

app.use((req, res, next) => {
  debug('Passing through to API');
  next();
});
app.use(require('./routes/api'));
app.use((req, res, next) => {
  debug('Passing through to Auth');
  next();
});
app.use(require('./routes/auth'));
app.use((req, res, next) => {
  debug('Passing through to User');
  next();
});
app.use(require('./routes/user'));

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') !== 'production') {
  app.use((err, req, res, next) => {
    console.log(err.stack);
    next(err);
  });
}

if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

app.use((err, req, res) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});

steem.api.setWebSocket('wss://steem.yt');

module.exports = app;
