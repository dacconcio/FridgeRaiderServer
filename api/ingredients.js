const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => { 

  //TO DO - Get it from DB when ready
  const ingredients = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'json/ingredients.json'))).ingredients;
  res.send(ingredients);

});

module.exports = router;