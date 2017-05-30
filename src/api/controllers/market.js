// Find project working directory
var src = process.cwd() + '/src/';

var utils = require(src + 'helpers/utils'),
    log   = require(src + 'helpers/logging')(module);

// Load Models
var Market = require(src + 'panfleto/models/market');
var Product = require(src + 'panfleto/models/product');

// constant fields
var MAX_SAFE_INTEGER = 9007199254740991;

module.exports.markets = function (req, res) {
    var page   = Math.min(req.query.page, MAX_SAFE_INTEGER),
        offset = page !== MAX_SAFE_INTEGER ? Math.max(req.query.offset - 1, 0) : 0;

    Market.find()
        .limit(page)
        .skip (page * offset)
        .sort ({ created: 'desc' })
        .populate('address')
        .exec(function (err, markets) {
            if (err) {
                var myErrObject = utils.resultError(err);

                log.error(myErrObject.error_description);
                res.status(500).json(myErrObject);
            } else {
                var message = 'Markets found with success!';

                log.info(message);
                return res.json({ markets: markets, status: 'ok', message: message})
            }
        });

};

module.exports.market  = function (req, res) {
    Market.findById(req.params.id)
        .populate('address')
        .exec(function (err, market) {
            var message;
            if (err) {
                var myErrObject = utils.resultError(err);

                log.error(myErrObject.error_description);
                res.status(500).json(myErrObject);
            } else if (!market) {
                message = 'Market not found with id: %s'.format(req.params.id);

                log.error(message);
                return res.status(404).json({status: 'error', error: 'UserError', error_description: message});
            } else {
                message = 'Market found with success!';

                log.info(message);
                return res.json({ market: market, status: 'ok', message: message });
            }
        });
};

module.exports.products  = function (req, res) {
    Product.find({marketId: req.params.id}, function(err, products) {
        if (err) return res.json({ status: 'error', error: err });
        else return res.json({ status: 'ok', products: products });
    })
};
