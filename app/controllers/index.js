module.exports.index = function(application, req, res){

  res.status(200);
  
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
}
