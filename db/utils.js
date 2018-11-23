const neode = require('./conn');

const findAllNodes = (model) => {
  const builder = neode.query();
  return builder.match('n', model)
    .return('properties(n) as result')
    .execute()
    .then(response => response.records)
    .then(result => result.map(element => element.toObject()['result']));
}

const findNode = (model, params) => {
  return neode.first(model, params)
    .then( result => {
      if(!result) {
        return null;
      }
      return result.properties();
    });
}

module.exports = {
  findAllNodes,
  findNode,
}