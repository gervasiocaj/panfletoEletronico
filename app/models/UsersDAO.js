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

        var autorizado; //so enquanto nao tem session

        if (result[0] != undefined){
          autorizado = true;
          // req.session.autorizado = true;
          // req.session.user = result[0].user;
        }

        if (autorizado){ // if (req.session.autorizado){
          res.render('itemRegister', {errors : {}, formData : {}});
        } else{
          res.render('login', {errors : {}, formData : {}});
        }

        });
        mongoclient.close();
    });
  });
}

module.exports = function(){
  return UsersDAO;
}
