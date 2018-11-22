const fs = require('fs');
const path = require('path');
const jwt = require('jwt-simple')
const { isAuthenticated } = require('./utils')
const express = require('express');
const router = express.Router();

router.post('/', (req, res, next) => { 
  const { userName, password } = req.body;

  //TO DO - Get it from DB when ready
  const users = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'json/users.json'))).users;
  const user = users.find(user => user.userName === userName && user.password === password);

  if(!user) {
    return next({ status: 401 });
  }
  
  const token = jwt.encode({ id: user.id, userName: user.userName}, process.env.JWT_SECRET);
  res.send({ token })

});

router.get('/', isAuthenticated, (req, res, next) => {
  if(!req.user) {
    return next({ status: 401 })
  }
  res.send(req.user);
});

module.exports = router;