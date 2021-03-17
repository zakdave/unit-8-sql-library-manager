 const createError = require('http-errors');
 const express = require('express');
 const path = require('path');
 const cookieParser = require('cookie-parser');
 const logger = require('morgan');
 const {sequelize} = require('./models');

 const indexRouter = require('./routes/index');
 const usersRouter = require('./routes/users');

 const app = express();
 
// Establish connection to the database
(async () => {
  try{
    await sequelize.authenticate();
    console.log('Succesful connection to database')
    await sequelize.sync()
  }catch(error){
    console.log("Oops, we couldn't establish a connection to the database", error)
  }
})();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error();
  err.message = 'Page is not here... a ghost, perhaps?'
  err.status = 404;

  console.log(`${err} / Status ${err.status}`);
  next(err);
});

app.use((err, req, res, next) => {
// Render page-not-found
  if (err.status === 404) {
    res.status(err.status).render('page-not-found', { err });
  } else {
    err.message = err.message || 'Server issue, sorry...';
    res.status(err.status || 500).render('error', { err } );
  }
});

module.exports = app;
