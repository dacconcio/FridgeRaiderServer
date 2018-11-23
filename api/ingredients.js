const express = require('express');
const { findAllNodes, Models } = require('../db')
const router = express.Router();

router.get('/', (req, res, next) => { 

  findAllNodes(Models.Ingredient)
    .then(ingredients => res.send(ingredients))
    .catch(next);

});

module.exports = router;