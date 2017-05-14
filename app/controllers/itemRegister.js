module.exports.itemRegister = function(application, req, res){
  res.render('itemRegister', {errors : {}, formData : {}});
}

module.exports.itemRegisterPost = function(application, req, res){
  var formData = req.body;

  console.log(formData);

	req.assert('titulo', 'Título não pode ser vazio').notEmpty();
	req.assert('descricao', 'Descrição não pode ser vazia').notEmpty();

  if (formData.oferta == ''){
  	req.assert('precoN', 'Preço normal não pode ser vazio').notEmpty();
  	req.assert('precoO', 'Preço da oferta não pode ser vazio').notEmpty();
  }

  var errors = req.validationErrors();

  if ((formData.oferta != '') && (formData.promocao != '') && (formData.sorteio != '')){
    var customError;
      console.log(errors);
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

  console.log(errors);

	if  (errors){
			res.render('itemRegister', {errors : errors, formData : formData});
			return ;
	}

  // var connection = application.config.dbConnection;

  res.render('itemRegister', {errors : {}, formData : {}});
}
