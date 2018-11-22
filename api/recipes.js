const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => { 

  //TO DO - Get it from DB when ready
  const recipes = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'json/recipes.json'))).recipes;
  res.send(recipes);

});

router.get('/:id', (req, res, next) => { 

  //TO DO - Get it from DB when ready
  const recipes = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'json/recipes.json'))).recipes;
  const result = recipes.find(recipe => recipe.id == req.params.id);
  res.send(result);
  
  });

  module.exports = router;