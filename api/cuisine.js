const express = require('express');
const { findAllNodes, findNode, updateNode, createNode, Models } = require('../db')
const router = express.Router();

router.get('/', (req, res, next) => { 

  findAllNodes(Models.Cuisine)
    .then(cuisine => res.send(cuisine))
    .catch(next);

});

router.get('/:id', (req, res, next) => { 

  findNode(Models.Cuisine, { id: req.params.id })
    .then(cuisine => res.send(cuisine))
    .catch(next);

});

router.put('/:id', (req, res, next) => { 

  updateNode(Models.Cuisine, {id: req.params.id}, req.body)
    .then(() => res.redirect(303, `/api/cuisine/${req.params.id}`))
    .catch(next);

});

router.post('/', (req, res, next) => { 
  const { name } = req.body;
  createNode(Models.Cuisine, { name })
    .then(() => findNode(Models.Cuisine, { name }))
    .then((response) => res.redirect(`/api/cuisine/${response.id}`))
    .catch(next);
});

module.exports = router;