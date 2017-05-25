var mongoose = require('mongoose'),
    validator = require('mongoose-validator'),
    Schema = mongoose.Schema;

// Find project working directory
var src = process.cwd() + '/src/';

var config = require(src + 'helpers/appConf');

var ImageSchema = new Schema({

    data: {
        type: Buffer,
        required: true
    },

    size: {
        type: String,
        required: true,
        validate: validator({
            validator: 'isInt', arguments: { min: 0, max: 5242880 },
            message  : 'Tamanho máximo de 5MB da imagem excedido!'})
    },

    mimetype: {
        type: String,
        required: true,
        enum: config.get('images:mimetype')
    },

    encoding: {
        type: String,
        required: true
    }

}, {
    versionKey: false
});


module.exports = mongoose.model('Image', ImageSchema);