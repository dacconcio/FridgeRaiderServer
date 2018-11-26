const express = require('express');
const axios = require('axios');
const { parse } = require('recipe-ingredient-parser');
const { API_KEY } = require('../config'); 
const { findAllNodes, findNode, findRelationships, Models, Relationships, 
  findConditionalNodes, createRelationship, createNode } = require('../db')
const router = express.Router();

router.get('/:id', (req, res, next) => { 
  let result;
  findNode(Models.Recipe, {id: req.params.id })
    .then(recipe => {
      result = recipe;
      return Promise.all([
        findRelationships(Models.Recipe, `n.id='${recipe.id}'`, Relationships.POSTED_BY, 'direction_out', Models.User),
        findRelationships(Models.Recipe, `n.id='${result.id}'`, Relationships.REVIEWED_BY, 'direction_out', Models.User),
        findRelationships(Models.Recipe, `n.id='${result.id}'`, Relationships.IS_OF_CATEGORY, 'direction_out', Models.Category),
        findRelationships(Models.Recipe, `n.id='${result.id}'`, Relationships.IS_OF_CUISINE, 'direction_out', Models.Cuisine),
        findRelationships(Models.Recipe, `n.id='${result.id}'`, Relationships.HAS_INGREDIENT, 'direction_out', Models.Ingredient),
      ])
    }).then(([ postedBy, reviews, category, cuisine, ingredients ]) => {
      result = { ...result, postedBy, reviews, category, cuisine, ingredients };
      res.send(result);
    }).catch(next)
});

router.get('/', async (req, res, next) => { 
  let recipes;
  const { ingredients } = req.query;
  try {
    if(ingredients) {
      recipes = await findConditionalNodes(Models.Recipe, 
        `t.name IN [${ingredients.split(',').map(i => `'${i.trim()}'`).join(',')}]`, 
        Relationships.HAS_INGREDIENT, 
        'direction_out', 
        Models.Ingredient
      )
    } else {
      recipes = await findAllNodes(Models.Recipe)
    }
    res.send(recipes);
  } 
  catch(error) {
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
  ).then(() => res.redirect(303, `/api/recipes/${req.params.id}`))
  .catch(next);
});

router.post('/', async (req, res, next) => { 
  const { name, instructions, postedByUserId, categoryName, cuisineName, ingredients } = req.body;
  const imageUrl = req.body.imageUrl ? req.body.imageUrl : '';
  const videoUrl = req.body.videoUrl ? req.body.videoUrl : '';
  try 
  {
    await createNode(Models.Recipe, { name, instructions, imageUrl, videoUrl });
    await createRelationship(
      { model: Models.Recipe, params: { name } },
      { model: Models.User, params: { id: postedByUserId } },
      Relationships.postedBy
    );
    await createRelationship(
      { model: Models.User, params: { id: postedByUserId } },
      { model: Models.Recipe, params: { name } },
      Relationships.hasPosted
    );
  
    let category = await findNode(Models.Category, { name: categoryName });
    if(!category) {
      category = await createNode(Models.Category, { name: categoryName });
    }
    await createRelationship(
      { model: Models.Recipe, params: { name } },
      { model: Models.Category, params: { name: categoryName } },
      Relationships.isOfCategory
    );

    let cuisine = await findNode(Models.Cuisine, { name: cuisineName });
    if(!cuisine) {
      cuisine = await createNode(Models.Cuisine, { name: cuisineName });
    }
    await createRelationship(
      { model: Models.Recipe, params: { name } },
      { model: Models.Cuisine, params: { name: cuisineName } },
      Relationships.isOfCuisine
    );
  
    const lines = ingredients.match(/[^\r\n]+/g);
    for(let i = 0; i < lines.length; i++) {
      const { quantity, unit, ingredient } = parse(lines[i]);
      let ingredientNode = await findNode(Models.Ingredient, { name: ingredient });
      if(!ingredientNode) 
      {
        const response = await axios.post(
          'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/products/classify',
          { title: ingredient, upc:'', plu_code:''},
          { 
            headers: {
              'X-Mashape-Key': API_KEY,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            } 
          })
        const breadcrumbs = response.data.breadcrumbs.filter(b => b != 'ingredient');
        const tags = (breadcrumbs && breadcrumbs.length) ? breadcrumbs.join(',') : '';
        const typeRaw = breadcrumbs.pop();
        const type = typeRaw ? typeRaw : 'Unknown';

        ingredientNode = await createNode(Models.Ingredient, { name: ingredient, tags });
        let ingredientType = await findNode(Models.IngredientType, { name: type });
        if(!ingredientType) {
          ingredientType = await createNode(Models.IngredientType, { name: type });
        }
        await createRelationship(
          { model: Models.Ingredient, params: { name: ingredient } },
          { model: Models.IngredientType, params: { name: type } },
          Relationships.isOfIngredientType
        );
      }
      await createRelationship(
        { model: Models.Recipe, params: { name } },
        { model: Models.Ingredient, params: { name: ingredient } },
        Relationships.hasIngredient,
        { measure: `${quantity} ${unit}`}
      );
    }
    const response = await findNode(Models.Recipe, { name })
    res.redirect(`/api/recipes/${response.id}`); 
  } 
  catch(error) 
  {
    next(error);
  }
});

module.exports = router;