module.exports.itemRegisterView = function(application, req, res){
  if(req.session.autorizado != true){
      res.status(401);
      res.send('Usuario precisa estar logado');
      return;
    }

  res.render('itemRegister', {errors : {}, formData : {}});
}

module.exports.itemGet = function(application, req, res){
  if(req.session.autorizado != true){
      res.status(200);
      res.send('Lista de itens');
      return;
    }

  res.render('itemRegister', {errors : {}, formData : {}});
}

module.exports.itemPost = function(application, req, res){
  if(req.session.autorizado != true){
      res.status(401);
      res.send('Usuario precisa estar logado');
      return;
    }

  var formData = req.body;

	req.assert('titulo', 'Título não pode ser vazio').notEmpty();
	req.assert('descricao', 'Descrição não pode ser vazia').notEmpty();

  if (formData.tipo == 'oferta'){
  	req.assert('precoN', 'Preço normal não pode ser vazio').notEmpty();
  	req.assert('precoO', 'Preço da oferta não pode ser vazio').notEmpty();
  	req.assert('precoN', 'Preço normal deve conter apenas números').isFloat();
  	req.assert('precoO', 'Preço da oferta deve conter apenas números').isFloat();
  }
  else{
    delete formData['precoN'];
    delete formData['precoO'];
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

  formData['manager'] = req.session.manager;
  formData['company'] = req.session.company;
  delete formData['submit'];

  var hasImage;
  if (req.files.imagem.size != 0){
    var fs = require('fs');

    hasImage = true;
    var formImage = req.files.imagem;

    //bloco responsável para criar o nome unico para o itemRegister
    var date = new Date();
    var time_stamp = date.getTime();
    var url_imagem = time_stamp + '_' + formImage.originalFilename;
    var path_origem = formImage.path;
    var path_destino = './uploads/' + url_imagem;
    formData['path'] = path_destino;

    fs.rename(path_origem, path_destino, function(err){
      if(err){
        res.status(500);
        res.send('Erro ' + err);
        return;
      }
    });

  }
  else{
    hasImage = false;
  }

	ItensDAO.insertItem(formData);

  res.render('itemRegister', {errors : {}, formData : {}});
}
