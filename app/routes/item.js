module.exports = function(application){
	application.get('/itemRegister', function(req, res){
    application.app.controllers.item.itemRegisterView(application, req, res);
	});

	application.post('/item', function(req, res){
    application.app.controllers.item.itemPost(application, req, res);
	});

	application.get('/item', function(req, res){
    application.app.controllers.item.itemGet(application, req, res);
	});
}
