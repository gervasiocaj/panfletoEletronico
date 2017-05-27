var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

// Find the src path
var src = process.cwd() + '/src/';

// Load Models
var Market = require(src + 'panfleto/models/market');

/* Required for persistent login sessions,
 * passport needs ability to serialize and deserialize users out of session
**/

// Used to serialize the user for the session
passport.serializeUser(function (market, done) {
    done(null, market.marketId);
});

// Used to deserialize the user
passport.deserializeUser(function (_id, done) {
    Market.findById(_id, function (err, market) {
        done(err, market);
    });
});

passport.use(new LocalStrategy({
        // By default, local strategy uses username and password, we will override with login
        usernameField: 'login',
        passwordField: 'password',
        passReqToCallback : true
    },
    function (req, login, password, done) {
        var message;
        Market.findOne( {$or: [{ login: login }, { email: login }]}, function (err, market) {
            if (err) {
                req.flash('message', ['Erro interno no banco de dados']);
                return done(err);
            }
            if (!market) {
                req.flash('message', ['Empresa não encontrada com login ou email: ' + login]);
                return done(null, false);
            }
            if (!market.checkPassword(password)) {
                req.flash('message', ['Senha incorreta!']);
                return done(null, false);
            }
            return done(null, market);
        });
    }
));

// Middleware to make sure a market manager is logged in
passport.isAuthenticated = function () {
    return function (req, res, next) {
        if (req.isAuthenticated())
            return next();

        req.flash('message', ['Faça login para acessar o conteúdo do site']);
        res.locals.error = req.flash();

        res.render('login', {data: {}});
    }
};
