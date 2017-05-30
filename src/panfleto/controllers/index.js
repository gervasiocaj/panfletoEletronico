var passport = require('passport');

// Find project working directory
var src = process.cwd() + '/src/';

var utils = require(src + 'helpers/utils'),
    log   = require(src + 'helpers/logging')(module);

var passwordReminder = require(src + 'helpers/pwdReminder');

// Load models
var Market = require(src + 'panfleto/models/market');

module.exports.home = function(req, res) {
    var flash = req.flash();

    if (flash.hasProperties())
        res.locals.succezz = flash;

    res.render('home');
};

module.exports.login = function (req, res) {
    var flash = req.flash();

    if (flash.hasProperties())
        res.locals.succezz = flash;

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
    var flash = req.flash();

    if (flash.hasProperties())
        res.locals.succezz = flash;

    res.render('register', {data : {}});
};

module.exports.pwdForgot = function (req, res) {
    var flash = req.flash();

    if (flash.hasProperties())
        res.locals.succezz = flash;
    
    res.render('forgotPassword', {data: {}})
};

module.exports.pwdReminder = function (req, res) {
    if (!passwordReminder.isRunning()) {
        //TODO(diegoadolfo): create action to report this
    }

    Market.findOne({email: req.body.email}, function (err, market) {
        var message;
        if (err) {
            message = 'Error interno no banco de dados, entre em contato com a equipe do PanfletoEletronico®';
            log.error(err.message || message);

            /* Set flash error message */
            req.flash('message', [message]);

            res.locals.error = req.flash();
            return res.status(500).render('forgotPassword', { data: {} })
        } else if (!market) {
            req.flash('message', ['Administrador não encontrado com o email: %s'.format(req.body.email)]);

            res.locals.error = req.flash();
            return res.status(404).render('forgotPassword', { data: {} })
        } else {
            passwordReminder.sendPwdReminder(market, function (err, info) {
                if (err) {
                    message = 'Error interno ao enviar o email, entre em contato com a equipe do PanfletoEletronico®';
                    log.error(err.message || message);

                    /* Set flash error message */
                    req.flash('message', [message]);

                    res.locals.error = req.flash();
                    return res.status(500).render('forgotPassword', { data: {} })
                }
                req.flash('message', ['Email enviado com sucesso para o endereço: %s'.format(req.body.email)]);
                res.redirect('/login')
            })
        }
    });
};
