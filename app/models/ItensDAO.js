function ItensDAO(connection){
  this._connection = connection();
}

ItensDAO.prototype.insertItem = function(item){
  this._connection.open(function(error, mongoclient){
    mongoclient.collection('item', function(error, collection){

        collection.insert(item);

        mongoclient.close();
    });
  });
}

module.exports = function(){
  return ItensDAO;
}
