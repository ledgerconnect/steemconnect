const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const http = require('http');
const https = require('https');
http.globalAgent.maxSockets = Infinity;
https.globalAgent.maxSockets = Infinity;
const cookieParser = require('cookie-parser');
const cors = require('cors');
const steem = require('steem');
const { init } = require('./helpers/middleware');
const api = require('./routes/api');
const oauth2 = require('./routes/oauth2');
const front = require('./routes/front');

const app = express();
const server = http.Server(app);

if (process.env.NODE_ENV !== 'production')
  require('./webpack/webpack')(app);

const hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/partials');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.enable('trust proxy');

app.use((req, res, next) => {
  res.steem = steem;
  next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use(init);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.use('/api/v1', api);
app.use('/oauth2', oauth2);
app.use('/', front);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : err;

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

module.exports = { app, server };
