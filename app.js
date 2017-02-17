const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const http = require('http');
const https = require('https');
const cors = require('cors');
const helmet = require('helmet');
const csurf = require('csurf');
const Raven = require('raven');
const steem = require('steem');
const debug = require('debug')('steemconnect:main');

const index = require('./routes/index');
const api = require('./routes/api');
const auth = require('./routes/auth');
const embed = require('./routes/embed');

http.globalAgent.maxSockets = 100;
https.globalAgent.maxSockets = 100;

const app = express();

if (process.env.SENTRY_DSN) {
  Raven.config(process.env.SENTRY_DSN).install();
  app.use(Raven.requestHandler());
}

if (process.env.NODE_ENV !== 'production') {
  require('./webpack')(app); // eslint-disable-line
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(helmet({ frameguard: false }));
app.use(cookieParser());

app.get('/loaderio-09d794fb07ae242522b107c6eb88734a.txt', (req, res) => {
  res.send('loaderio-09d794fb07ae242522b107c6eb88734a');
});

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

app.use('/embed', embed);
app.use(api);
app.use(auth);
app.use(index);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') !== 'production') {
  if (process.env.SENTRY_DSN) app.use(Raven.errorHandler());
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

steem.api.setWebSocket('wss://steemd.steemit.com');

module.exports = app;
