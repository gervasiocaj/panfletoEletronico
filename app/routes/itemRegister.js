module.exports = function(application){
	application.get('/itemCadastro', function(req, res){
    application.app.controllers.itemRegister.itemRegister(application, req, res);
	});

	application.post('/itemCadastro', function(req, res){
    application.app.controllers.itemRegister.itemRegisterPost(application, req, res);
	});
}
