var express = require('express'),
    router = express.Router();

// Find project working directory
var src = process.cwd() + '/src/';

// Load Controllers
var controller = require(src + 'panfleto/controllers/index');

/* GET home page*/
router.get ('/', controller.home);

/* GET login page. */
router.get ('/login', controller.login);

/* POST request for login into application */
router.post('/login', controller.signIn);

/* GET register page */
router.get ('/register', controller.register);

module.exports = router;
