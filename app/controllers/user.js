module.exports.registerView = function(application, req, res){
  res.render('register', {errors : {}, formData : {}});
}

module.exports.userPost = function(application, req, res){
  var formData = req.body;

	req.assert('username', 'Usuário não pode ser vazio').notEmpty();
	req.assert('password', 'Senha não pode ser vazia').notEmpty();
	req.assert('company', 'Empresa não pode ser vazia').notEmpty();
	req.assert('password2', 'Senha não pode ser vazia').notEmpty();
  req.assert('password', 'As senhas devem ser iguais').equals(formData.password2);

  var errors = req.validationErrors();

	if  (errors){
			res.render('register', {errors : errors, formData : formData});
			return ;
	}

  var connection = application.config.dbConnection;
	var ManagerDAO = new application.app.models.ManagerDAO(connection);

  delete formData['password2']; //remove o campo password2 do form

	ManagerDAO.insertManager(formData);

  res.render('login', {errors : {}, formData : {}});
}