var express = require('express'),
    router = express.Router();

// Find project working directory
var src = process.cwd() + '/src/';

// Load Controllers
var controller = require(src + 'api/controllers/market');

/* GET all markets*/
router.get ('/', controller.markets);

/* GET a specific market*/
router.get('/:id', controller.market);

/* GET the products in a specific market*/
router.get('/:id/product', controller.products);

module.exports = router;
