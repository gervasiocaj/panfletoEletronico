// Initialize geo services
var geocoder = require('node-geocoder');

// Find project working directory
var src = process.cwd() + '/src/';

var config = require(src + 'helpers/appConf'),
    log    = require(src + 'helpers/logging')(module);

var options  = {
    provider: 'google',

    // Optional depending of the providers
    httpAdapter: 'https',
    clientId   : config.get('geocode:clientId'),
    apiKey     : config.get('geocode:apiKey'),
    language   : 'pt-BR',
    region     : '.br',
    formatter  : null
};

// Get Node Geocoder using Google and Here as provider
var hereGeocoder = geocoder(options);

module.exports.getGeoCoordinates = function (address, next) {
    hereGeocoder.geocode(address,  function (error, result) {
        if (error) {
            next(error, null);
        } else {
            if (result.length > 1) {
                log.info("Get multiples addresses, get coordinates at first position");
            }
            var coordinates = {
                latitude : result[0].latitude,
                longitude: result[0].longitude
            };
            next(null, coordinates);
        }
    });
};