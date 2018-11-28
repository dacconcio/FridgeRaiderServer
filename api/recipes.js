const express = require('express');
const { findAllNodes, findNode, findRelationships, Models, Relationships, saveRecipe, deleteNode,
  findConditionalNodes, createRelationship, updateRecipe } = require('../db')
const router = express.Router();

const neode = require('../db/conn')

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

// router.get('/', async (req, res, next) => { 
//   let recipes;
//   const { ingredients } = req.query;
//   try {
//     if(ingredients) {
//       recipes = await findConditionalNodes(Models.Recipe, 
//         `t.name IN [${ingredients.split(',').map(i => `'${i.trim()}'`).join(',')}]`, 
//         Relationships.HAS_INGREDIENT, 
//         'direction_out', 
//         Models.Ingredient
//       )
//     } else {
//       recipes = await findAllNodes(Models.Recipe)
//     }
//     console.log('RECIPE RES SEND ', recipes)
//     res.send(recipes);
//   } 
//   catch(error) {
//     next(error);
//   }
// });

// ************ Jarret's testing something
router.get('/', async (req, res, next) => {
  const { ingredients } = req.query;
  const dbQuery = `
  with [${ingredients.split(',').map(i => `'${i.trim()}'`).join(',')}] as names
  match (i:Ingredient) <- [:HAS_INGREDIENT] - (r:Recipe)
  where i.name in names
  with r, size(names) as inputCnt, count(distinct i) as cnt
  where cnt >= 1
  return r
  order by cnt desc limit 10
  `;
  neode.cypher(dbQuery)
  .then(results => {
    return neode.hydrate(results, 'r').toJson()
  })
  .then(json => {
    console.log(json)
    res.send(json)
  })
});
// ************ End of Jarret's testing

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

router.put('/:id', (req, res, next) => { 
  const { name, instructions, categoryName, cuisineName, ingredients, imageUrl, videoUrl } = req.body;
  const id = req.params.id;

  updateRecipe(id, categoryName, cuisineName, ingredients, {name, instructions, imageUrl, videoUrl})
    .then(() => res.redirect(303, `/api/recipes/${id}`))
    .catch(next)
});

router.post('/', (req, res, next) => { 
  const { name, instructions, postedByUserId, categoryName, cuisineName, ingredients } = req.body;
  const imageUrl = req.body.imageUrl ? req.body.imageUrl : '';
  const videoUrl = req.body.videoUrl ? req.body.videoUrl : '';
  
  saveRecipe({ name, instructions, postedByUserId, categoryName, cuisineName, ingredients, imageUrl, videoUrl})
    .then(id => res.redirect(`/api/recipes/${id}`))
    .catch(next)
});

router.delete("/:id", (req, res, next) => {
  deleteNode(Models.Recipe, {id: req.params.id })
    .then(() => res.sendStatus(204))
    .catch(next);
});

module.exports = router;