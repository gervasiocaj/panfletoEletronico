var express = require('express'),
    router = express.Router();

// Find project working directory
var src = process.cwd() + '/src/';

// Load Controllers
var controller = require(src + 'panfleto/controllers/market');

/* POST request for create a market into application */
router.post('/register', controller.signUp);

module.exports = router;
