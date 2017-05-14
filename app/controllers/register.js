module.exports.register = function(application, req, res){
  res.render('register', {errors : {}, formData : {}});
}

module.exports.registerPost = function(application, req, res){
  var formData = req.body;

	req.assert('username', 'Usuário não pode ser vazio').notEmpty();
	req.assert('password', 'Senha não pode ser vazia').notEmpty();
	req.assert('password2', 'Senha não pode ser vazia').notEmpty();

  var errors = req.validationErrors();

	if  (errors){
			res.render('register', {errors : errors, formData : formData});
			return ;
	}

  // var connection = application.config.dbConnection;

  res.render('login', {errors : {}, formData : {}});
}
