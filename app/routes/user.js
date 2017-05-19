module.exports = function(application){
	application.get('/cadastro', function(req, res){
    application.app.controllers.user.registerView(application, req, res);
	});

	application.post('/user', function(req, res){
    application.app.controllers.user.userPost(application, req, res);
	});
}
