const express = require('express');
const { findAllNodes, Models } = require('../db')
const router = express.Router();

router.get('/', (req, res, next) => { 

  findAllNodes(Models.Cuisine)
    .then(cuisine => res.send(cuisine))
    .catch(next);

});

module.exports = router;