function ItensDAO(connection){
  this._connection = connection();
}

ItensDAO.prototype.insertItem = function(item, user){
  this._connection.open(function(error, mongoclient){
    mongoclient.collection('item', function(error, collection){

        item['user'] = user;
        collection.insert(item);

        mongoclient.close();
    });
  });
}

module.exports = function(){
  return ItensDAO;
}
