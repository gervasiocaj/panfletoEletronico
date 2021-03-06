var express = require('express'),
    router = express.Router();

// Find project working directory
var src = process.cwd() + '/src/';

// Load Controllers
var controller = require(src + 'api/controllers/api');

/* GET API Status */
router.get('/', controller.status);

/* GET API Status */
router.get('/status', controller.status);

module.exports = router;
