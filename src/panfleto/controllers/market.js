// Find the src path
var src = process.cwd() + '/src/';

// Load Models
var Market  = require(src + 'panfleto/models/market'),
	Address = require(src + 'panfleto/models/address'),
	utils   = require(src + 'helpers/utils');

module.exports.signUp = function (req, res) {
	var data = req.body;
    // Nested Objects of Market in data
    var address  = data.address;

    // Validate password field
	var passwordInvalid = utils.passwordValidator(data.password, data.passconf);
    delete data.passconf;

	if (passwordInvalid) {
        req.flash('message', passwordInvalid.error_description);
        res.locals.error = req.flash();

        delete data.password;
        return res.render('register', { data: data });
	}
	delete data.address;
    var market = new Market(data);
	// Referencing nested address object into Market
	market.address = new Address(address);

	market.save()
		.then(function (market) {
			req.flash('message', ['Empresa cadastrada com sucesso!']);

			return res.redirect('/login');
    })
		.catch(function (err) {
			req.flash('message', utils.extractErrorInfo(err));
			res.locals.error = req.flash();

			Object.keys(data.networks).forEach(function (idx) {
				delete data.networks[idx].password
            });
			delete data.password;

			data.address = address;
			return res.render('register', { data: data })
	})
};
