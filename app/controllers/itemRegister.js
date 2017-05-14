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

  if (formData.oferta == 'on'){
  	req.assert('precoN', 'Preço normal não pode ser vazio').notEmpty();
  	req.assert('precoO', 'Preço da oferta não pode ser vazio').notEmpty();
  }

  var errors = req.validationErrors();

  if ((formData.oferta  == undefined) && (formData.promocao  == undefined) && (formData.sorteio  == undefined)){
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

  // var connection = application.config.dbConnection;

  res.render('itemRegister', {errors : {}, formData : {}});
}
