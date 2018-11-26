const express = require('express');
const { findAllNodes, findNode, findRelationships, createRelationship, deleteRelationship,
  Models, Relationships, createNode, updateNode } = require('../db')
const router = express.Router();

router.get('/:id', (req, res, next) => { 
  let result;
  findNode(Models.User, {id: req.params.id })
    .then(user => {
      result = user;
      return findRelationships(Models.User, `n.id='${result.id}'`, Relationships.HAS_SAVED, 'direction_out', Models.Recipe);
    }).then(savedRecipes => {
      result = { ...result, savedRecipes };
      return findRelationships(Models.User, `n.id='${result.id}'`, Relationships.HAS_POSTED, 'direction_out', Models.Recipe);
    }).then(postedRecipes => {
      result = { ...result, postedRecipes };
      res.send(result)
    }).catch(next);

});

router.get('/', (req, res, next) => { 

  findAllNodes(Models.User)
    .then(users => res.send(users))
    .catch(next);

});

router.post('/', (req, res, next) => { 
  const { name, userName, password, email } = req.body;
  createNode(Models.User, { name, userName, password, email })
    .then(() => findNode(Models.User, { userName }))
    .then((response) => res.redirect(`/api/users/${response.id}`))
    .catch(next);
});

router.put('/:id/saveRecipe/:recipeId', (req, res, next) => { 
  createRelationship(
    { model: Models.User, params: {id: req.params.id} },
    { model: Models.Recipe, params: {id: req.params.recipeId} },
    Relationships.hasSaved
  ).then(() => res.redirect(303, `/api/users/${req.params.id}`))
  .catch(next);
});

router.put('/:id/unSaveRecipe/:recipeId', (req, res, next) => { 
  deleteRelationship(
      Models.User, 
      Models.Recipe, 
      `n.id='${req.params.id}' and t.id='${req.params.recipeId}'`, 
      Relationships.HAS_SAVED, 
      'direction_out')
    .then(() => res.redirect(303, `/api/users/${req.params.id}`))
    .catch(next);
});

router.put('/:id', (req, res, next) => { 
  updateNode(Models.User, {id: req.params.id}, req.body)
    .then(() => res.redirect(303, `/api/users/${req.params.id}`))
    .catch(next);
});


module.exports = router;