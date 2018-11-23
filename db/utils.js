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

const findRelationships = (model, params, relation, direction, target) => {
  return neode.query()
    .match('n', model)
    .where(params)
    .relationship(relation, direction, 'r')
    .to('t', target)
    .return('properties(t) as result')
    .execute()
    .then(response => response.records)
    .then(result => {
      let relationships = [];
      if(result.length) {
        relationships = result.map(element => element.toObject()['result'])
      }
      return relationships;
    });
}

module.exports = {
  findAllNodes,
  findNode,
  findRelationships
}