var passport = require('passport');

module.exports.home = function(req, res){
  res.type('text').send('Server Online');
};

module.exports.login = function (req, res) {
    res.locals.success = req.flash();

    /* Render login page */
    res.render('login', {data: {}});
};

module.exports.signIn = function (req, res, next) {
    passport.authenticate('local', function (err, market, info) {

        // Generate a response reflecting authentication status
        if (err || !market) {
            res.locals.error = req.flash();
            return res.status(404).render('login', {data: {}});
        }
        req.login(market, function (err) {
            if (err) {
                return next(err);
            }
            req.flash('message', ["Conectado com o login '%s' em %s".format(market.login, market.company)]);
            res.redirect('/item')
        });
    })(req, res, next);
};

module.exports.register = function(req, res) {
    res.render('register', {data : {}});
};