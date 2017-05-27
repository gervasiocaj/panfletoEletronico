// Find the src path
var src = process.cwd() + '/src/';

// Load Models
var Market = require(src + 'panfleto/models/market'),
	utils  = require(src + 'helpers/utils');

module.exports.signUp = function (req, res) {
	var data = req.body;

	// Validate password field
	var passwordInvalid = utils.passwordValidator(data.password, data.passconf);
    delete data.passconf;

	if (passwordInvalid) {
        req.flash('message', passwordInvalid.error_description);
        res.locals.error = req.flash();

        delete data.password;
        return res.render('register', { data: data });
	}

    var market = new Market(data);

	market.save()
		.then(function (market) {
			req.flash('message', ['Empresa cadastrada com sucesso!']);

			return res.redirect('/login');
    })
		.catch(function (err) {
			req.flash('message', utils.extractErrorInfo(err));

			res.locals.error = req.flash();

			delete data.password;
			return res.render('register', { data: data })
	})
};
