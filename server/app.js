const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const routeHome = require('./routes/home');
const routeWechat = require('./routes/wechat.js');
const apiIndex = require('./routes/index');
const apiLogin = require('./routes/login');
const apiUser = require('./routes/user');
const apiAdmin = require('./routes/admin');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'vidyapathaisalwaysrunning',
  resave: true,
  saveUninitialized: true,
}));

// route
app.use('/', routeHome);
app.use('/wechat', routeWechat);
// API 版本 1.0
app.use('/api', apiIndex);
app.use('/api', apiLogin);
app.use('/api/user', apiUser);
app.use('/admin', apiAdmin);

// catch 404 and forward to error handler
app.use((req, res) => {
  // eslint-disable-next-line no-console
  console.log('404');
  // 直接跳转到首页
  return res.redirect('/');
  // const err = new Error('Not Found');
  // err.status = 404;
  // next(err);
});

// error handlers

// development error handler
// will print stacktrace
// console.log('env: ', app.get('env'));
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});


module.exports = app;
