module.exports.index = function(application, req, res){
  res.format({
    html: function(){
      res.status(200);
      res.send('Servidor online');
    },

    json: function(){
      var jsnReturn = { status : 'online' };
      res.setHeader('Content-Type', 'application/json');
      res.status(200);
      res.json(jsnReturn);
    }
  })
}
