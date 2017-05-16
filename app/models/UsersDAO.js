var crypto = require('crypto');

function UsersDAO(connection){
  this._connection = connection();
}

UsersDAO.prototype.insertUser = function(user){
  this._connection.open(function(error, mongoclient){
    mongoclient.collection('user', function(error, collection){

        var crypto_password = crypto.createHash('md5').update(user.password).digest('hex');
        user.password = crypto_password;

        collection.insert(user);

        mongoclient.close();
    });
  });
}

UsersDAO.prototype.authenticate = function(user, req, res){
  this._connection.open(function(error, mongoclient){
    mongoclient.collection('user', function(error, collection){

        var crypto_password = crypto.createHash('md5').update(user.password).digest('hex');
        user.password = crypto_password;

        collection.find(user).toArray(function(error, result){

        if (result[0] != undefined){
          autorizado = true;
          req.session.autorizado = true;
          req.session.user = result[0].username;
        }

        if (req.session.autorizado){
          res.status(200);
          res.format({
            html: function(){
              res.render('itemRegister', {errors : {}, formData : {}});
            },

            json: function(){
              var jsnReturn = { status : 'authorized' };
              res.setHeader('Content-Type', 'application/json');
              res.json(jsnReturn);
            }
          })
        } else{
          res.status(401);
          res.format({
            html: function(){
              res.render('login', {errors : {}, formData : {}});
            },

            json: function(){
              var jsnReturn = { status : 'unauthorized' };
              res.setHeader('Content-Type', 'application/json');
              res.json(jsnReturn);
            }
          })

        }

        });
        mongoclient.close();
    });
  });
}

module.exports = function(){
  return UsersDAO;
}
