module.exports = function(application){
	application.get('/cadastro', function(req, res){
    application.app.controllers.register.register(application, req, res);
	});
}
