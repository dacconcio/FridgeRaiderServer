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

const findConditionalNodes = (model, params, relation, direction, target) => { 

  return neode.query()
    .match('n', model)
    .relationship(relation, direction, 'r')
    .to('t', target)
    .where(params)
    .return('properties (n) as result')
    .execute()
    .then(data => data.records)
    .then(result => {
      let response = [];
      if(result.length) {
        response = result.map(element => element.toObject()['result'])
      }
      return response;
    });
}

const findRelationships = (model, params, relation, direction, target) => {
  return neode.query()
    .match('n', model)
    .where(params)
    .relationship(relation, direction, 'r')
    .to('t', target)
    .return('properties(t) as properties_target, properties(r) as properties_relation')
    .execute()
    .then(response => response.records)
    .then(result => {
      let relationships = [];
      if(result.length) {
        relationships = result.map(element => {
          return {
            properties: element.toObject()['properties_target'],
            relation: element.toObject()['properties_relation']
          }
        })
      }
      return relationships;
    });
}

const createRelationship = (source, target, relationship) => {
  let sourceNode;
  return neode.first(source.model, source.params)
   .then( result => {
      sourceNode = result;
      return neode.first(target.model, target.params)
    }).then( targetNode => {
      return sourceNode.relateTo(targetNode, relationship);
    })
}

const deleteRelationship = (source, target, params, relation, direction) => {
  return neode.query()
    .match('n', source)
    .relationship(relation, direction, 'r')
    .to('t', target)
    .where(params)
    .delete('r')
    .execute();
}

module.exports = {
  findAllNodes,
  findNode,
  findRelationships,
  createRelationship,
  deleteRelationship,
  findConditionalNodes
}