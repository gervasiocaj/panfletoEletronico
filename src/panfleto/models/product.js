var mongoose = require('mongoose'),
    validator = require('mongoose-validator'),
    uniqueValidator = require('mongoose-unique-validator'),
    Schema = mongoose.Schema;

// Find the src path
var src = process.cwd() + '/src/';

// Load Models
var Market = require(src + 'panfleto/models/market');

var ProductSchema = new Schema({
    marketId: {
        type: Schema.Types.ObjectId,
        ref: 'Market',
        required: true,
        exists: true
    },

    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    price: {
        type: String,
        required: true,
        validate: validator({
            validator: 'isFloat', arguments: { min: 0 },
            message  : 'O preço do produto deve ser um número real positivo'})
    },

    barCode: {
        type: String,
        required: true
    }

}, {
    versionKey: false,
    collection: 'products',
    discriminatorKey: '_type'
});

ProductSchema.virtual('vPrice')
    .get(function () {
        return this.price;
    })
    .set(function (price) {
        this.price = price.replaceAll(',', '.')
    });

ProductSchema.methods.toJSON = function () {
    return {
        _id        : this._id,
        _type      : this._type,
        name       : this.name,
        description: this.description,
        price      : this.price,
        barCode    : this.barCode
    }
};

// Applying plugins to schema
ProductSchema.plugin(uniqueValidator);


module.exports = mongoose.model('Product', ProductSchema);