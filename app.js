var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var usuarios = require('./routes/usuarios');
var recetas = require('./routes/recetas');
var comentarios = require('./routes/comentarios');
var pedidos = require('./routes/pedidos');
var ingredientes = require('./routes/ingredientes');
var categorias = require('./routes/categorias')
var login = require('./routes/login')
var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/web',express.static('web'));
app.use('/handlebars',express.static('handlebars'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/saludo', function (pet, resp) {
    var mensajes = ['Hola soy el API', '¿Qué tal, React?', 'EYYYYYYYY!!!']
    var obj = {
        mensaje: mensajes[Math.floor(Math.random()*mensajes.length)],
        hora: new Date().toLocaleTimeString()
    }
    resp.json(obj);
});

app.use('/', routes);
app.use('/login', login);
app.use('/usuarios',usuarios)
app.use('/recetas',recetas)
app.use('/comentarios',comentarios)
app.use('/pedidos',pedidos)
app.use('/ingredientes',ingredientes)
app.use('/categorias',categorias)
app.use('/doc', function (req, res) {
    res.sendFile(__dirname + '/doc/documentacion.html');
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
