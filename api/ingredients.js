const express = require('express');
const { findAllNodes, findNode, updateNode, Models } = require('../db')
const router = express.Router();

router.get('/', (req, res, next) => { 

  findAllNodes(Models.Ingredient)
    .then(ingredients => res.send(ingredients.map(ingredient => ingredient.name)))
    .catch(next);

});

router.get('/:id', (req, res, next) => { 

  findNode(Models.Ingredient, { id: req.params.id })
    .then(ingredient => res.send(ingredient))
    .catch(next);

});

router.put('/:id', (req, res, next) => { 
  const { tags } = req.body;
  updateNode(Models.Ingredient, {id: req.params.id}, { tags })
    .then(() => res.redirect(303, `/api/ingredients/${req.params.id}`))
    .catch(next);

});

module.exports = router;