var mongoose = require('mongoose'),
    validator = require('mongoose-validator'),
    uniqueValidator = require('mongoose-unique-validator'),
    Schema = mongoose.Schema;


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

// Applying plugins to schema
AddressSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Address', AddressSchema);
