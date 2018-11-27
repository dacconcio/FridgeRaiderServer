const express = require('express');
const {
  findAllNodes,
  findNode,
  findRelationships,
  createRelationship,
  deleteRelationship,
  Models,
  Relationships,
  createNode,
  updateNode
} = require('../db');
const router = express.Router();

const { firebaseApiKey } = require('../env.js');

let admin = require('firebase-admin');

let config = {
  apiKey: firebaseApiKey,
  authDomain: 'fridgeraider-d65aa.firebaseapp.com',
  projectId: 'fridgeraider-d65aa'
};

admin.initializeApp(config);

router.get('/:id', (req, res, next) => {
  let result;
  findNode(Models.User, { id: req.params.id })
    .then(user => {
      result = user;
      return Promise.all([
        findRelationships(
          Models.User,
          `n.id='${result.id}'`,
          Relationships.HAS_SAVED,
          'direction_out',
          Models.Recipe
        ),
        findRelationships(
          Models.User,
          `n.id='${result.id}'`,
          Relationships.HAS_POSTED,
          'direction_out',
          Models.Recipe
        )
      ]);
    })
    .then(([savedRecipes, postedRecipes]) => {
      result = { ...result, savedRecipes, postedRecipes };
      res.send(result);
    })
    .catch(next);
});

router.post('/firebase-auth/', async (req, res, next) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(req.body.idToken);

    if (!decodedToken.email) {
      return res.sendStatus(401);
    }

    let result;
    const user = await findNode(Models.User, { email: decodedToken.email });
    result = user;
    if (!user) {
      return res.send({});
    }

    const savedRecipes = await findRelationships(
      Models.User,
      `n.id='${result.id}'`,
      Relationships.HAS_SAVED,
      'direction_out',
      Models.Recipe
    );

    const postedRecipes = await findRelationships(
      Models.User,
      `n.id='${result.id}'`,
      Relationships.HAS_POSTED,
      'direction_out',
      Models.Recipe
    );

    result = { ...result, savedRecipes, postedRecipes };
    res.send(result);
  } catch (err) {
    next(err);
  }
});

router.get('/', (req, res, next) => {
  findAllNodes(Models.User)
    .then(users => res.send(users))
    .catch(next);
});

router.post('/', (req, res, next) => {
  const { name, userName, password, email } = req.body;
  createNode(Models.User, { name, userName, password, email })
    .then(() => findNode(Models.User, { userName }))
    .then(response => res.redirect(`/api/users/${response.id}`))
    .catch(next);
});

router.put('/:id/saveRecipe/:recipeId', (req, res, next) => {
  createRelationship(
    { model: Models.User, params: { id: req.params.id } },
    { model: Models.Recipe, params: { id: req.params.recipeId } },
    Relationships.hasSaved
  )
    .then(() => res.redirect(303, `/api/users/${req.params.id}`))
    .catch(next);
});

router.put('/:id/unSaveRecipe/:recipeId', (req, res, next) => {
  deleteRelationship(
    Models.User,
    Models.Recipe,
    `n.id='${req.params.id}' and t.id='${req.params.recipeId}'`,
    Relationships.HAS_SAVED,
    'direction_out'
  )
    .then(() => res.redirect(303, `/api/users/${req.params.id}`))
    .catch(next);
});

router.put('/:id', (req, res, next) => {
  updateNode(Models.User, { id: req.params.id }, req.body)
    .then(() => res.redirect(303, `/api/users/${req.params.id}`))
    .catch(next);
});

module.exports = router;
