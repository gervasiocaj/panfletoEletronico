var crypto = require('crypto'),
    mongoose = require('mongoose'),
    validator = require('mongoose-validator'),
    uniqueValidator = require('mongoose-unique-validator'),
    Schema = mongoose.Schema;

// Find the src path
var src = process.cwd() + '/src/';

var log = require(src + 'helpers/logging')(module);

// Load Models
var Address = require(src + 'panfleto/models/address');

// Custom validator functions
validator.extend('chkNetworkSize',
    function (networks) { return networks.length > 0 }, 'Network array is empty'
);


var MarketSchema = new Schema({

    login: {
        type: String,
        unique: true,
        required: true
    },

    company: {
        type: String,
        require: true
    },

    email: {
        type: String,
        unique: true,
        required: false,
        validate: validator({validator: 'isEmail', message: 'Endereço de email inválido'})
    },

    hash: {
        type: String
    },

    salt: {
        type: String
    },

    address: {
        type: Schema.Types.ObjectId,
        ref: 'Address',
        required: true,
        exists: true
    },

    networks: {
        type: [{
            name: {
                type: String,
                required: true
            },
            password: {
                type: String,
                required: true
            }
        }],
        validate: validator({
            validator: 'chkNetworkSize',
            message  : 'É necessário infomar pelo menos uma rede para o acesso dos clientes dentro no mercado'
        })
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
        this.hash = this.encryptPassword(password);
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
        dec      = decipher.update(this.hash, 'hex', 'utf8');

    return dec + decipher.final('utf8');
};

MarketSchema.methods.checkPassword = function(password) {
    return this.encryptPassword(password) === this.hash;
};

// Register cascading actions
MarketSchema.pre('save', function (next) {
    var nestedAddress = this.address;

    nestedAddress.save()
        .then(function (address) {
            log.info('Market address save with success!');
            next()
        })
        .catch(function (err) {
            log.error('Error to save market address, please check this!');
            next(err)
        });
});

// Applying plugins to schema
MarketSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Market', MarketSchema);
