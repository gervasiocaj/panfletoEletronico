module.exports = function(application){
	application.get('/', function(req, res){

		res.format({
			html: function(){
				res.send('Servidor online');
			},

			json: function(){
				var jsnReturn = { status : 'online' };
				res.setHeader('Content-Type', 'application/json');
				res.json(jsnReturn);
			}
		})
	});
}
