const express = require('express');
const { findAllNodes, findNode, findRelationships, createRelationship, deleteRelationship,
  Models, Relationships } = require('../db')
const router = express.Router();

router.put('/:id/saveRecipe/:recipeId', (req, res, next) => { 
  createRelationship(
    { model: Models.User, params: {id: req.params.id} },
    { model: Models.Recipe, params: {id: req.params.recipeId} },
    Relationships.hasSaved
  ).then(() => res.sendStatus(204))
  .catch(next);
});

router.put('/:id/unSaveRecipe/:recipeId', (req, res, next) => { 
  deleteRelationship(
      Models.User, 
      Models.Recipe, 
      `n.id='${req.params.id}' and t.id='${req.params.recipeId}'`, 
      Relationships.HAS_SAVED, 
      'direction_out')
    .then(() => res.sendStatus(204))
    .catch(next);
});

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