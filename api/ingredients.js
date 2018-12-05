const express = require('express');
const { findAllNodes, findNode, updateNode, Models } = require('../db')
const router = express.Router();
const Clarifai = require('clarifai')
const config = require('../config')
const FileReader = require('filereader')
const multiparty = require('multiparty');

router.get('/', (req, res, next) => { 

  findAllNodes(Models.Ingredient)
    .then(ingredients => res.send(ingredients.map(ingredient => ingredient.name)))
    .catch(next);

});

router.post('/image', async (req, res, next) => { 
  const clarifai = new Clarifai.App({
    apiKey: process.env.CLARIFAI_KEY
   });
   const form = new multiparty.Form();
   form.parse(req, async (error, fields, files) => {
    try {
      // const file = files.file[0];
      // var reader = new FileReader();
      // var url = reader.readAsDataURL(file);
      // reader.onloadend = () => {
        return clarifai.models.predict("bd367be194cf45149e75f01d59f77ba7", files.file[0].path)
        .then( ingredients => res.send(ingredients))
      // }
    } 
    catch(error) {
      next(error);
    }
  })
});

router.get('/:id', (req, res, next) => { 

  findNode(Models.Ingredient, { id: req.params.id })
    .then(ingredient => res.send(ingredient))
    .catch(next);

});

router.put('/:id', (req, res, next) => { 
  const { tags } = req.body;
  updateNode(Models.Ingredient, {id: req.params.id}, { tags })
    .then(() => res.redirect(303, `/api/ingredients/${req.params.id}`))
    .catch(next);

});

module.exports = router;