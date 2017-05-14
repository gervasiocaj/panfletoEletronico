module.exports = function(application){
	application.get('/login', function(req, res){
    application.app.controllers.login.login(application, req, res);
	});

	application.post('/login', function(req, res){
    application.app.controllers.login.loginPost(application, req, res);
	});
}
