const jwt = require('jwt-simple')
const { isAuthenticated } = require('./utils')
const db = require('../db');
const express = require('express');
const router = express.Router();

router.post('/', (req, res, next) => { 
    const { userName, password } = req.body;

    //TO DO - Get it from DB when ready
    const users = JSON.parse(fs.readFileSync('users.json')).users;

    users.find(user => user.userName === userName && user.password === password)
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