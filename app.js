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

http.globalAgent.maxSockets = 100;
https.globalAgent.maxSockets = 100;

const app = express();

if (process.env.NODE_ENV !== 'production') {
  require('./webpack')(app); // eslint-disable-line
}

/* TODO For testing remove later */
process.env.SESSION_SECRET = process.env.SESSION_SECRET || 'some!!@@secret123';
process.env.PRIME = 'eca59a04b80707d8bf72739b9e97f0692ef5614c83128e520348aa3cd81c1e3b';
process.env.PUBLIC_KEY = '0467e93f4a008220dc4f89a8446ffb96592b8a64222b71839392263b8eb9ccd1c8be169261eb41069b9a4e19e424b5d10749ce2dd8b0dafcc188a9a0865f768b83';
process.env.PRIVATE_KEY = '70e97a7091f238948dd6efecbee658b1fb4b684fd6883cea4ff50cfc149b6d3a';
process.env.JWT_SECRET = 'a2a30bd6fc5f44c1b30439db8b7ef0833effda2e505fbed65e96e889919f1813';
process.env.CRYPTO_MOD = 'secp256k1';

// view engine setup
hbs.registerPartials(path.join(__dirname, 'views/partials'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(helmet());
app.use(cookieParser());
app.use(logger('dev'));
app.use(csurf({ cookie: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.use(cors({ credentials: true, origin: true }));
app.use(verifyToken);
app.use('/', require('./routes/api'));
app.use('/', require('./routes/app'));
app.use('/', require('./routes/user'));

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

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


module.exports = app;
