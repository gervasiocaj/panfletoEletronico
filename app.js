/* importar as configurações do servidor */
var app = require('./config/server');

/* parametrizar a porta de escuta */
var port = 5000;
app.listen(port, function(){
	console.log('Servidor online porta: ' + port);
})
