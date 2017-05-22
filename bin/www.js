#!/usr/bin/env node

var debug = require('debug')('restapi'),
    https = require('http');

// Find the src path
var src = process.cwd() + '/src/';

var app  = require(src + 'app'),
    conf = require(src + 'helpers/appConf'),
    log  = require(src + 'helpers/logging')(module);

app.set('port', process.env.PORT || conf.get('port') || 5000);

// Create a server HTTPS
var server = https.createServer(app);

server.listen(app.get('port'), function () {
    var message = 'Express server listening on port ' + app.get('port');

    debug(message);
    log.info(message);
});
