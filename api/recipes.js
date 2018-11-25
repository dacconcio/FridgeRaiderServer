const express = require('express');
const { findAllNodes, findNode, findRelationships, Models, Relationships, 
  findConditionalNodes, createRelationship } = require('../db')
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

router.get('/', async (req, res, next) => { 
  let recipes;
  const ingredients = req.query.ingredients;

  try 
  {
    if(ingredients) 
    {
      recipes = await findConditionalNodes(Models.Recipe, 
        `t.name IN [${ingredients.split(',').map(i => `'${i.trim()}'`).join(',')}]`, 
        Relationships.HAS_INGREDIENT, 
        'direction_out', 
        Models.Ingredient
      )
    } 
    else 
    {
      recipes = await findAllNodes(Models.Recipe)
    }
    res.send(recipes);
  } 
  catch(error) 
  {
    next(error);
  }
});

router.put('/:id/review/:userId', (req, res, next) => { 
  const { rating, description } = req.body;
  createRelationship(
    { model: Models.Recipe, params: {id: req.params.id} },
    { model: Models.User, params: {id: req.params.userId} },
    Relationships.reviewedBy,
    { rating, description }
  ).then(() => res.sendStatus(204))
  .catch(next);
});

module.exports = router;