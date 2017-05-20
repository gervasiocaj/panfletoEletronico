var mongo = require('mongodb');

var conMongoDb = function(){
  console.log('DB online');
  var db = new mongo.Db(
    'panfletoEletronico',
    new mongo.Server(
      '127.0.0.1',
      27017,
      {}
    ),
    {}
  );

  return db;
};

module.exports = function(){
  return conMongoDb;
};
