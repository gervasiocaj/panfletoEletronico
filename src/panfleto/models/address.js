var mongoose = require('mongoose'),
    validator = require('mongoose-validator'),
    uniqueValidator = require('mongoose-unique-validator'),
    Schema = mongoose.Schema;

// Find project working directory
var src = process.cwd() + '/src/';

var geoCoder = require(src + 'helpers/geoCoder'),
    log      = require(src + 'helpers/logging')(module);


var AddressSchema = new Schema({

    street: {
        type: String,
        required: true
    },

    number: {
        type: String
    },

    postalCode: {
        type: String,
        validate: validator({
            validator: 'matches',
            passIfEmpty: true,
            arguments: /^[0-9]{5}-[0-9]{3}$/i,
            message  : 'Erro, o CEP deve esta formatado conforme o padrão XXXXX-XXX'
        })
    },

    city: {
        type: String,
        required: true
    },

    province: {
        type: String,
        required: true
    },

    country: {
        type: String,
        required: true
    },

    latitude: {
        type: String,
        validate: validator({
            validator: 'matches',
            passIfEmpty: true,
            arguments: /^(\+|-)?(?:90(?:(?:\.0{1,8})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,8})?))$/i,
            message  : 'Não foi possível validar as coordenadas geográficas do endereço fornecido'
        })
    },

    longitude: {
        type: String,
        validate: validator({
            validator: 'matches',
            passIfEmpty: true,
            arguments: /^(\+|-)?(?:180(?:(?:\.0{1,8})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,8})?))$/i,
            message  : 'Não foi possível validar as coordenadas geográficas do endereço fornecido'
        })
    }

}, {
    versionKey: false
});

AddressSchema.virtual('coordinates')
    .set(function (coordinates) {
        this.latitude  = coordinates.latitude;
        this.longitude = coordinates.longitude;
    })
    .get(function () {
        return { latitude : this.latitude, longitude: this.longitude }
    });

AddressSchema.virtual('localization')
    .get(function () {
        return {
            address: this.number ? '%s %s'.format(this.number, this.street) : this.street,
            city   : this.city,
            state  : this.province,
            country: this.country,
            zipcode: this.postalCode
        }
    });

AddressSchema.methods.toJSON = function () {
    return {
        street     : this.street,
        number     : this.number,
        postalCode : this.postalCode,
        city       : this.city,
        province   : this.province,
        country    : this.country,
        coordinates: this.coordinates
    }
};

// Register cascading actions
AddressSchema.pre('save', function (next) {
    var self = this;
    geoCoder.getGeoCoordinates(this.localization, function (err, coordinates) {
        if (err)
            log.warn('Cannot find address coordinates. Error caused by: %s', err.message);
        else
            self.coordinates = coordinates;
        next();
    });
});

// Applying plugins to schema
AddressSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Address', AddressSchema);
