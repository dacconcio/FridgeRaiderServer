const neode = require('./conn');

const findAllNodes = (model) => { 
  return neode.all(model)
    .then( result => {
      if(!result) {
        return [];
      }
      return result.toJson();
    });
}

const findNode = (model, params) => {
  return neode.first(model, params)
   .then( result => {
      if(!result) {
        return null;
      }
      return result.toJson();
    });
}

module.exports = {
  findAllNodes,
  findNode,
}