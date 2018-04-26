/* eslint-disable no-param-reassign,new-cap */
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');
const https = require('https');
const csp = require('express-csp-header');
const cors = require('cors');
const steem = require('@steemit/steem-js');
const db = require('./db/models');
const { strategy } = require('./helpers/middleware');
const logger = require('./helpers/logger');

if (process.env.STEEMD_URL_SERVER) {
  steem.api.setOptions({ url: process.env.STEEMD_URL_SERVER });
} else if (process.env.STEEMD_URL) {
  steem.api.setOptions({ url: process.env.STEEMD_URL });
}

http.globalAgent.maxSockets = Infinity;
https.globalAgent.maxSockets = Infinity;
const app = express();
const server = http.Server(app);

// iframe header
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  next();
});

// Content security policies
app.use(csp({
  policies: {
    'default-src': (process.env.CSP_DEFAULT || "'self'").split(','),
    'script-src': (process.env.CSP_SCRIPT_SRC || "'self','unsafe-eval','unsafe-inline'").split(','),
    'connect-src': (process.env.CSP_CONNECT_SRC || "'self'").split(','),
    'frame-src': (process.env.CSP_FRAME_SRC || "'self'").split(','),
    'style-src': (process.env.CSP_STYLE_SRC || "'self'").split(','),
    'img-src': (process.env.CSP_IMG_SRC || "'self'").split(','),
    'font-src': (process.env.CSP_FONT_SRC || "'self'").split(','),
  },
}));

// logging middleware
app.use((req, res, next) => {
  const start = process.hrtime();
  const reqId = req.headers['x-amzn-trace-id'] ||
    req.headers['x-request-id'] ||
    `dev-${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)}`;
  const reqIp = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress;
  req.log = logger.child({ req_id: reqId, ip: reqIp });
  req.log.debug({ req }, '<-- request');
  res.set('X-Request-Id', reqId);
  const logOut = () => {
    const delta = process.hrtime(start);
    const info = {
      ms: (delta[0] * 1e3) + (delta[1] / 1e6),
      code: res.statusCode,
    };
    req.log.info(info, '%s %s%s', req.method, req.baseUrl, req.url);
    req.log.debug({ res }, '--> response');
  };
  res.once('finish', logOut);
  res.once('close', logOut);
  next();
});

if (process.env.NODE_ENV !== 'production') {
  logger.info('running in development mode');
  // eslint-disable-next-line global-require
  require('./webpack/webpack')(app);
}

const hbs = require('hbs');

hbs.registerPartials(`${__dirname}/views/partials`);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.enable('trust proxy');
app.disable('x-powered-by');

app.use((req, res, next) => {
  req.steem = steem;
  req.db = db;
  next();
});

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

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : err;

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

module.exports = { app, server };
