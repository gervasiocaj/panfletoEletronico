var express = require('express'),
    router = express.Router();


/* GET API Status. */
router.get('/', function (req, res) {
    res.json({status: 'ok', message: 'API do Panfleto Eletrônico esta online'});
});

module.exports = router;
