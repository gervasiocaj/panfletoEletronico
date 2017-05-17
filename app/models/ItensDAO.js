function ItensDAO(connection){
  this._connection = connection();
}

ItensDAO.prototype.insertItem = function(item, manager, company){
  this._connection.open(function(error, mongoclient){
    mongoclient.collection('item', function(error, collection){

        item['manager'] = manager;
        item['company'] = company;

        console.log(item);

        collection.insert(item);

        mongoclient.close();
    });
  });
}

module.exports = function(){
  return ItensDAO;
}
