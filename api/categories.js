const express = require('express');
const { findAllNodes, Models } = require('../db')
const router = express.Router();

router.get('/', (req, res, next) => { 

  findAllNodes(Models.Category)
    .then(categories => res.send(categories))
    .catch(next);

});

module.exports = router;