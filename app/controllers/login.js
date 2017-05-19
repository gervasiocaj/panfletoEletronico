module.exports.loginView = function(application, req, res){
  res.status(200);
  res.render('login', {errors : {}, formData : {}});
}

module.exports.loginPost = function(application, req, res){
  var formData = req.body;

	req.assert('username', 'Usuário não pode ser vazio').notEmpty();
	req.assert('password', 'Senha não pode ser vazia').notEmpty();

  var errors = req.validationErrors();

	if  (errors){
      res.status(400);
      res.render('login', {errors : errors, formData : formData});
			return;
	}

  var connection = application.config.dbConnection;
  var ManagerDAO = new application.app.models.ManagerDAO(connection, req, res);

  ManagerDAO.authenticate(formData, req, res);
}
