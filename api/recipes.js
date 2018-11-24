const express = require('express');
const { findAllNodes, findNode, findRelationships, Models, Relationships, findConditionalNodes } = require('../db')
const router = express.Router();

router.post('/ingredients/', (req, res, next) => { 
  const list = req.body.ingredients;
  findConditionalNodes(Models.Recipe, 
      `t.name IN [${list.split(',').map(i => `'${i.trim()}'`).join(',')}]`, 
      Relationships.HAS_INGREDIENT, 
      'direction_out', 
      Models.Ingredient
    ).then(recipes => res.send(recipes))
    .catch(next);

});

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
      return findRelationships(Models.Recipe, `n.id='${result.id}'`, Relationships.REVIEWED_BY, 'direction_out', Models.User)
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