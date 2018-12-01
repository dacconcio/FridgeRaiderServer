const express = require('express');
const {
  findAllNodes,
  findNode,
  updateNode,
  createNode,
  Models
} = require('../db');
const router = express.Router();

router.get('/', (req, res, next) => {
  findAllNodes(Models.Category)
    .then(categories => res.send(categories))
    .catch(next);
});

router.get('/names', (req, res, next) => {
  findAllNodes(Models.Category)
    .then(categories => {
      const names = categories.map(category => category.name);
      return res.send(names);
    })
    .catch(next);
});

router.get('/:id', (req, res, next) => {
  findNode(Models.Category, { id: req.params.id })
    .then(category => res.send(category))
    .catch(next);
});

router.put('/:id', (req, res, next) => {
  updateNode(Models.Category, { id: req.params.id }, req.body)
    .then(() => res.redirect(303, `/api/categories/${req.params.id}`))
    .catch(next);
});

router.post('/', (req, res, next) => {
  const { name } = req.body;
  createNode(Models.Category, { name })
    .then(() => findNode(Models.Category, { name }))
    .then(response => res.redirect(`/api/categories/${response.id}`))
    .catch(next);
});

module.exports = router;
