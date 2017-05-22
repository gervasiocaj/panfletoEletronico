var express = require('express'),
    passport = require('passport'),
    router = express.Router();

// Find project working directory
var src = process.cwd() + '/src/';

// Load Controllers
var controller = require(src + 'panfleto/controllers/item');

/* GET items page */
router.get('/', passport.isAuthenticated(), controller.getItemView);

/* POST request for create a item into application */
router.post('/', passport.isAuthenticated(), controller.createItem);

/* GET a details of a item*/
router.get('/:id', passport.isAuthenticated(), controller.getItem);

module.exports = router;

