const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const http = require('http');
const https = require('https');
const cors = require('cors');
const steem = require('@steemit/steem-js');
const Raven = require('raven');
const db = require('./db/models');
const { strategy } = require('./helpers/middleware');

Raven.config(process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN).install();

if (process.env.STEEMJS_URL) {
  steem.api.setOptions({ url: process.env.STEEMJS_URL });
}

http.globalAgent.maxSockets = Infinity;
https.globalAgent.maxSockets = Infinity;
const app = express();
const server = http.Server(app);

if (process.env.NODE_ENV !== 'production') { require('./webpack/webpack')(app); }

const hbs = require('hbs');
hbs.registerPartials(`${__dirname}/views/partials`);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.enable('trust proxy');

app.use(Raven.requestHandler());

app.use((req, res, next) => {
  req.steem = steem;
  req.db = db;
  next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use(strategy);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', require('./routes/api'));
app.use('/api/apps', require('./routes/apps'));
app.use('/', require('./routes/oauth2'));
app.use('/', require('./routes'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(Raven.errorHandler());
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : err;

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

module.exports = { app, server };
