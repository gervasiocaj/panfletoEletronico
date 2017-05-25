var express = require('express'),
    passport = require('passport'),
    router = express.Router();

// Find project working directory
var src = process.cwd() + '/src/';

var fileUploader = require(src + 'helpers/fileUploader');

// Load Controllers
var controller = require(src + 'panfleto/controllers/item');

/* GET items page */
router.get ('/', passport.isAuthenticated(), controller.view);

/* POST request for create a item into application */
router.post('/', fileUploader.single('image'), passport.isAuthenticated(), controller.create);

/* GET a details of a item*/
router.get ('/:id', passport.isAuthenticated(), controller.read);

module.exports = router;

