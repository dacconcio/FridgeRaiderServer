const express = require('express');
const { findAllNodes, findNode, findRelationships, Models, Relationships } = require('../db')
const router = express.Router();

router.get('/:id', (req, res, next) => { 

  let result;
  findNode(Models.User, {id: req.params.id })
    .then(user => {
      result = user;
      return findRelationships(Models.User, `n.id='${user.id}'`, Relationships.HAS_WRITTEN, 'direction_out', Models.Review)
    })
    .then(hasWrittenReviews => {
      result = {...result, hasWrittenReviews}
    })
    .then(() => {
      return findRelationships(Models.User, `n.id='${result.id}'`, Relationships.HAS_SAVED, 'direction_out', Models.Recipe)
    })
    .then(savedRecipes => {
      result = {...result, savedRecipes}
    })
    .then(() => {
      return findRelationships(Models.User, `n.id='${result.id}'`, Relationships.HAS_POSTED, 'direction_out', Models.Recipe)
    })
    .then(postedRecipes => {
      result = {...result, postedRecipes}
    })
    .then(() => res.send(result))
    .catch(next);

});

router.get('/', (req, res, next) => { 

  findAllNodes(Models.User)
    .then(users => res.send(users))
    .catch(next);

});

module.exports = router;