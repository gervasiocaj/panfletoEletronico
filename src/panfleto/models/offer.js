var mongoose = require('mongoose'),
    validator = require('mongoose-validator'),
    extend = require('mongoose-schema-extend'),
    Schema = mongoose.Schema;

// Find project working directory
var src = process.cwd() + '/src/';

var utils = require(src + 'helpers/utils'),
    Image = require(src + 'panfleto/models/image'),
    Product = require(src + 'panfleto/models/product');

// Custom validator functions
validator.extend(
    'chkDates',
    function (date) {
        return utils.dateFormatter(this.startDate) <= utils.dateFormatter(date)

    }, 'Data de entrada inválida'
);

validator.extend(
    'chkPrices',
    function (price) {
        var    isFloat = /^\+?([0-9]+([.][0-9]*)?|[.][0-9]+)$/;
        return isFloat.test(price) && +price < +this.price

    }, 'Preço de entrada inválida'
);


var OfferSchema = Product.schema.extend({

    newPrice: {
        type: String,
        required: true,
        validate: validator({
            validator: 'chkPrices',
            message  : 'O preço da oferta deve ser um número menor que o preço do produto'
        })
    },

    startDate: {
        type: Date,
        required: true,
        default: Date.now()
    },

    endDate: {
        type: Date,
        required: false,
        validate: validator({
            validator: 'chkDates',
            message  : 'Data final da oferta deve ser anterior a data de início'})
    },

    barCode: {
        type: String,
        required: false
    },

    image: {
        type: Schema.Types.ObjectId,
        ref: 'Image',
        exists: true
    }
}, {
    collection: 'promotions'
});

OfferSchema.methods.toJSON = function () {
    return {
        _id        : this._id,
        _type      : this._type,
        name       : this.name,
        description: this.description,
        price      : this.price,
        newPrice   : this.newPrice,
        startDate  : utils.dateFormatter(this.startDate),
        endDate    : utils.dateFormatter(this.endDate),
        barCode    : this.barCode,
        image      : this.image ? this.image._id : null
    }
};

// Register cascading actions
OfferSchema.pre('save', function (next) {
    var nestedObj = this.image;

    if (this.isNew && nestedObj) {
        nestedObj.save()
            .then(function (image) {
                next()
            })
            .catch(function (err) {
                next(err)
            })
    }
    next();
});


module.exports = mongoose.model('Offer', OfferSchema);

