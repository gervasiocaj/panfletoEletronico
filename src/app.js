var path = require('path'),
    morgan = require('morgan'),
    express = require('express'),
    flash = require('connect-flash'),
    favicon = require('serve-favicon'),
    session = require('express-session'),
    passport = require('passport'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    methodOverride = require('method-override');

var app = express(),
    src = process.cwd() + '/src/';

var config = require(src + '/helpers/appConf'),
    log    = require(src + '/helpers/logging')(module);

// view engine setup
app.set('view engine', 'ejs'); // Set up ejs for HTML templates
app.set('views', path.join(__dirname, 'panfleto/views'));

// set up our express application
app.use(cookieParser()); // Read cookies (needed for auth)
// Log every request to the console
app.use(morgan('dev'));
// HTTP PUT and DELETE support
app.use(methodOverride());
// Get information from html forms and JSON parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '../public')));
app.use(favicon(path.join(__dirname, '../public', 'images/favicon.ico')));

// Set passport
app.use(session(config.get('session')));
// Required for persistent login sessions (optional, but recommended)
app.use(passport.initialize());
app.use(passport.session());
// Use connect-flash for flash messages stored in session
app.use(flash());

// Load fully configured passport
require(src + 'authentication/auth');
// Create connection with mongoDB
require(src + 'db/mongoose');

// Load all routes
var login = require('./panfleto/routes/index'),
    market = require('./panfleto/routes/market'),
    item = require('./panfleto/routes/item');

// Load API routes
var api = require('./api/routes/api');

// Register routes
app.use('/', login);
app.use('/market', market);
app.use('/item', item);
app.use('/api', api);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.status(404);
    log.error('%s %d %s', req.method, res.statusCode, req.url);

    if (req.accepts('html'))
        // TODO(diegoadolfo): create a error404 page to render
        res.render();
    else if (req.accepts('json'))
        res.json({status: 'error', error: 'user_error', error_description: 'Resource not found'});
    else
        res.type('text').send('Resource not found');

    return next();
});

// Error handlers
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    log.error('%s %d %s', req.method, res.statusCode, err.message);

    if (req.accepts('html'))
        res.redirect(req.url);
    else if (req.accepts('json'))
        res.json({status: 'error', error: err.code || 'server_error', error_description: err.message});
    else
        res.type('text').send(err.message || 'Internal Server Error');

    return next();
});

module.exports = app;