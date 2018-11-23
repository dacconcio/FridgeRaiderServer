const jwt = require('jwt-simple')
const { isAuthenticated } = require('./utils')
const { findNode, Models } = require('../db')
const express = require('express');
const router = express.Router();

router.post('/', (req, res, next) => { 
  const { userName, password } = req.body;

  findNode(Models.User, { userName, password })
    .then( user => {
      if(!user) {
          return next({ status: 401 });
      }
      const token = jwt.encode({ id: user.id, userName: user.userName}, process.env.JWT_SECRET);
      res.send({ token })
    })
    .catch(next);
});

router.get('/', isAuthenticated, (req, res, next) => {
  if(!req.user) {
    return next({ status: 401 })
  }
  res.send(req.user);
});

module.exports = router;