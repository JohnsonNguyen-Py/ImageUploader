var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var handlebars = require("express-handlebars");
var sessions = require('express-session');
var mysqlSession = require('express-mysql-session')(sessions);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postRouter = require('./routes/posts');
var errorPrint = require('./helpers/debug/debugprinters').errorPrint;
var requestPrint = require('./helpers/debug/debugprinters').requestPrint;

const { join } = require('path');
const MySQLStore = require('express-mysql-session');
const router = require('./routes/users');
const routeProtectors = require('./middleware/routeproectors');

var app = express();


app.engine(
  "hbs",
  handlebars({
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/layouts/partials"),
    extname: ".hbs",
    defaultLayout: "home",
    helpers: {
      /**
       *
       *
       renderLink: () => {
 
 
        
       },
       *
       */
    },
  })
);




var mysqlSessionStore = new mysqlSession(
  {

    /* using default options */

  }

  , require("./config/database")

);




app.use(sessions({
  key: "csid",
  secret: "csc317",
  store: mysqlSessionStore,
  resave: false,
  saveUninitialized: false

}));

app.set("view engine", "hbs");
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  console.log("requestHandler Test"); // test
  requestPrint(req.url);
  next();
});

app.use((req, res, next) => {
  console.log(req.session);
  if (req.session.username) {
    res.locals.logged = true;
  }
  next();

});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postRouter);


app.use((err, req, res, next) => {
  console.log("errorhandler test"); //test
  console.log(err);
  res.render('error', { err_message: err });

});

module.exports = app;

