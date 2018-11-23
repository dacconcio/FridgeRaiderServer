const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/ingredients', require('./ingredients'));
router.use('/recipes', require('./recipes'));
router.use('/categories', require('./categories'));
router.use('/cuisine', require('./cuisine'));
router.use('/users', require('./users'));

module.exports = router;