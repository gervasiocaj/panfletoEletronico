var crypto = require('crypto');

function ManagerDAO(connection){
  this._connection = connection();
}

ManagerDAO.prototype.insertManager = function(manager){
  this._connection.open(function(error, mongoclient){
    mongoclient.collection('manager', function(error, collection){

        var crypto_password = crypto.createHash('md5').update(manager.password).digest('hex');
        manager.password = crypto_password;

        collection.insert(manager);

        mongoclient.close();
    });
  });
}

ManagerDAO.prototype.authenticate = function(manager, req, res){
  this._connection.open(function(error, mongoclient){
    mongoclient.collection('manager', function(error, collection){

        var crypto_password = crypto.createHash('md5').update(manager.password).digest('hex');
        manager.password = crypto_password;

        collection.find(manager).toArray(function(error, result){

        var managerFound = result[0];

        if (managerFound != undefined){
          autorizado = true;
          req.session.autorizado = true;
          req.session.manager = managerFound.username;
          req.session.company = managerFound.company;
        }

        if (req.session.autorizado){
          res.status(200);
          res.render('itemRegister', {errors : {}, formData : {}});
        } else{
          res.status(401);
          res.render('login', {errors : {}, formData : {}});
        }

        });
        mongoclient.close();
    });
  });
}

module.exports = function(){
  return ManagerDAO;
}
