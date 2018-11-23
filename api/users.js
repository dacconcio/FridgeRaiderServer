const express = require('express');
const { findAllNodes, findNode, Models } = require('../db')
const router = express.Router();

router.get('/:id', (req, res, next) => { 

  findNode(Models.User, {id: req.params.id })
    .then(user => res.send(user))
    .catch(next);

});

router.get('/', (req, res, next) => { 

  findAllNodes(Models.User)
    .then(users => res.send(users))
    .catch(next);

});

module.exports = router;