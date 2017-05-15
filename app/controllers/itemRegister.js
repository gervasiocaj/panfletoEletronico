module.exports.itemRegister = function(application, req, res){
  if(req.session.autorizado != true){
      res.send('Usuario precisa estar logado');
      return;
    }

  res.render('itemRegister', {errors : {}, formData : {}});
}

module.exports.itemRegisterPost = function(application, req, res){
  if(req.session.autorizado != true){
      res.send('Usuario precisa estar logado');
      return;
    }

  var formData = req.body;

	req.assert('titulo', 'Título não pode ser vazio').notEmpty();
	req.assert('descricao', 'Descrição não pode ser vazia').notEmpty();

  console.log(formData);
  console.log(formData.tip);
  console.log(formData.tipo  == undefined);

  if (formData.tipo == 'oferta'){
  	req.assert('precoN', 'Preço normal não pode ser vazio').notEmpty();
  	req.assert('precoO', 'Preço da oferta não pode ser vazio').notEmpty();
  	req.assert('precoN', 'Preço normal deve conter apenas números').isFloat();
  	req.assert('precoO', 'Preço da oferta deve conter apenas números').isFloat();
  }

  var errors = req.validationErrors();

  if (formData.tipo  == undefined){
    var customError;
      if(errors) {
        customError = { param: 'Item',
          msg: 'Selecione uma das opções de item',
          value: '' };
        errors.push(customError);
      }
      else{
        errors = [];
        customError = '{ "param": "Item", "msg": "Selecione uma das opções de item", "value": "" }';
        customError = JSON.parse(customError);
        errors.push(customError);
      }
  }

	if  (errors){
			res.render('itemRegister', {errors : errors, formData : formData});
			return ;
	}

  var connection = application.config.dbConnection;
	var ItensDAO = new application.app.models.ItensDAO(connection);

	ItensDAO.insertItem(formData);

  res.render('itemRegister', {errors : {}, formData : {}});
}
