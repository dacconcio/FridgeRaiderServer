const neode = require('./conn');

const findNode = (model, params) => {
  return neode.first(model, params)
    .then( result => {
      if(!result) {
        return null;
      }
      return result.properties()
    });
}

module.exports = {
  findNode,
}