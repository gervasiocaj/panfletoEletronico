module.exports.login = function(application, req, res){
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
      res.format({
        html: function(){
          res.render('login', {errors : errors, formData : formData});
        },

        json: function(){
          var jsnReturn = {errors : errors};
          res.setHeader('Content-Type', 'application/json');
          res.json(jsnReturn);
        }
      })
			return ;
	}

  var connection = application.config.dbConnection;
  var UsersDAO = new application.app.models.UsersDAO(connection, req, res);

  UsersDAO.authenticate(formData, req, res);
}
