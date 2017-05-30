#!/usr/bin/env node

var debug = require('debug')('restapi'),
    https = require('http');

// Find the src path
var src = process.cwd() + '/src/';

var app  = require(src + 'app'),
    conf = require(src + 'helpers/appConf'),
    log  = require(src + 'helpers/logging')(module);

var pwdReminder = require(src + 'helpers/pwdReminder');

app.set('port', process.env.PORT || conf.get('port') || 5000);

// Create a server HTTPS
var server = https.createServer(app);

server.listen(app.get('port'), function () {
    var message = 'Express server listening on port ' + app.get('port');
    server.emit('open', null);

    debug(message);
    log.info(message);
});

server.once('open', function () {
    pwdReminder.isRunning()
        .then(function () {
            log.info("Server is enabled to send password reminder messages to market administrators");
        })
        .catch(function (err) {
            log.error("Server is not enabled to send password reminder messages to users. Error caused by: " + err.message);
        })
});
