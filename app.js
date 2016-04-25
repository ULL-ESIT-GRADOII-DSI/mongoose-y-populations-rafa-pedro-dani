/*jslint browser: true, this: true*/
/*global
    __dirname, process
*/
'use strict';
const express = require('express'),
    logger = require('morgan'),
    bodyParser = require('body-parser');

let app = express();

// Usar bodyParser como Middleware
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

// Establecer la ruta de las vistas
app.set('views', `${__dirname}/views`);

// Motor de las vistas, que podría ser Jade, Mustache. Pero en la práctica vamos
// A usar EJS (EmbeddedJS)
app.set('view engine', 'ejs');

// Establecer el modo del logger
app.use(logger('dev'));

// Guardamos las rutas que nos proporciona index en index
const index = require('./routes/index'),
      csv = require('./routes/csv');

// Capturamos la variable de entorno NODE_ENV
const env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = (env === 'development');

// Rutas. Por defecto, que vaya al index.ejs
app.use('/', index);
app.use('/csv', csv);

app.use(require('node-sass-middleware')({
    src: `${__dirname}/assets/frontend`,
    dest: `${__dirname}/public`,
    outputStyle: 'compressed',
    sourceMap: false
}));

app.use(express.static(`${__dirname}/public`));

// Si se produce un error en la ruta, enviamos un not found
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err); // Dejamos el error lo maneje una de dos funciones
});

// Si estamos en un entorno de desarrollo (que se pasa poniéndolo en la consola)
// Mostramos un error con la pila de llamadas para poder debugear
if (app.get('env') === 'development') {
    app.use((err, req, res) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: '¡ERROR!'
        });
    });
}

// En cualquier otro caso, suponemos que NO estamos en un entorno de desarrollo
// Por lo que iniciamos el modo producción, en el que no se muestra la pila de
// llamadas
app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
        message: 'Esta página no existe :(',
        error: {},
        title: 'error'
    });
});

module.exports = app;
