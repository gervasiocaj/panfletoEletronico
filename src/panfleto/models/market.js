var crypto = require('crypto'),
    mongoose = require('mongoose'),
    validator = require('mongoose-validator'),
    uniqueValidator = require('mongoose-unique-validator'),
    Schema = mongoose.Schema;

var MarketSchema = new Schema({

    login: {
        type: String,
        unique: true,
        required: true
    },

    email: {
        type: String,
        unique: true,
        required: false,
        validate: validator({validator: 'isEmail', message: 'Endereço de email inválido'})
    },

    company: {
        type: String,
        require: true
    },

    hashedPassword: {
        type: String
    },

    salt: {
        type: String
    },

    created: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false
});

MarketSchema.virtual('marketId')
    .get(function () {
        return this._id;
    });

MarketSchema.virtual('password')
    .set(function(password) {
        // this._plainPassword = password;
        this.salt = crypto.randomBytes(32).toString('hex');
        
        // More secure
        // this.salt = crypto.randomBytes(128).toString('hex');
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() {
        return this.decryptPassword()
    });


MarketSchema.methods.encryptPassword = function(password) {
    var cipher    = crypto.createCipher('aes-256-cbc-hmac-sha1', this.salt),
        encrypted = cipher.update(password, 'utf8', 'hex');

    return encrypted + cipher.final('hex');

    // More secure
    // return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
    // return crypto.pbkdf2Sync(password, this.salt, 10000, 512).toString('hex');
};

MarketSchema.methods.decryptPassword = function () {
    var decipher = crypto.createDecipher('aes-256-cbc-hmac-sha1', this.salt),
        dec      = decipher.update(this.hashedPassword, 'hex', 'utf8');

    return dec + decipher.final('utf8');
};

MarketSchema.methods.checkPassword = function(password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

// Applying plugins to schema
MarketSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Market', MarketSchema);
