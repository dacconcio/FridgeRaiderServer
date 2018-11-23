const express = require('express');
const { findAllNodes, findNode, findRelationships, Models, Relationships } = require('../db')
const router = express.Router();

router.get('/:id', (req, res, next) => { 

  let result;
  findNode(Models.Recipe, {id: req.params.id })
    .then(recipe => {
      result = recipe;
      return findRelationships(Models.Recipe, `n.id='${recipe.id}'`, Relationships.POSTED_BY, 'direction_out', Models.User)
    })
    .then(postedBy => {
      result = {...result, postedBy}
    })
    .then(() => {
      return findRelationships(Models.Recipe, `n.id='${result.id}'`, Relationships.HAS_REVIEW, 'direction_out', Models.Review)
    })
    .then(reviews => {
      result = {...result, reviews}
    })
    .then(() => {
      return findRelationships(Models.Recipe, `n.id='${result.id}'`, Relationships.IS_OF_CATEGORY, 'direction_out', Models.Category)
    })
    .then(category => {
      result = {...result, category}
    })
    .then(() => {
      return findRelationships(Models.Recipe, `n.id='${result.id}'`, Relationships.IS_OF_CUISINE, 'direction_out', Models.Cuisine)
    })
    .then(cuisine => {
      result = {...result, cuisine}
    })
    .then(() => {
      return findRelationships(Models.Recipe, `n.id='${result.id}'`, Relationships.HAS_INGREDIENT, 'direction_out', Models.Ingredient)
    })
    .then(ingredients => {
      result = {...result, ingredients}
    })
    .then(() => res.send(result))
    .catch(next);

});

router.get('/', (req, res, next) => { 

  findAllNodes(Models.Recipe)
    .then(recipes => res.send(recipes))
    .catch(next);

});

module.exports = router;