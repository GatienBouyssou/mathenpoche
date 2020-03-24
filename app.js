let createError = require('http-errors');
let express = require('express');
let session = require('express-session');
let path = require('path');
let http = require('http');
let cookieParser = require('cookie-parser');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set("port", 6900);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(session({
  secret: 'nC0@#1pM/-0qA1+é',
  name: 'mathenpoche',
  resave: true,
  saveUninitialized: true
}));

app.use(function(request, response, next){
  response.locals.session = request.session;
  app.locals.login = request.session.login;
  next()
});

let exphbs = require('express-handlebars');
app.set('view engine', 'handlebars'); //nom de l'extension des fichiers
let handlebars  = require('./helpers/handlebars.js')(exphbs);
app.engine('handlebars', handlebars.engine);

handlebars = require('handlebars');
let layouts = require('handlebars-layouts');
handlebars.registerHelper(layouts(handlebars));

app.use(express.static(path.join(__dirname, 'public')));

require('./routes/router')(app);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Server Node.js is listening for requests on port ' + app.get('port'))
});

module.exports = app;
