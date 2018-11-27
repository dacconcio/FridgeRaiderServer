
const expect = require('chai').expect;
const supertest = require('supertest');
const { sync, createNode, createRelationship, findNode, Models, Relationships } = require('../db')
const app = supertest(require('../app'));

describe('Recipes Routes - /api/recipes/', () => {

  beforeEach( async () => {
    try {
      await sync();
      await createNode(Models.Ingredient, { name: 'Chicken' });
      await createNode(Models.Ingredient, { name: 'Salt' });
      await createNode(Models.Category, { name: 'Lunch' });
      await createNode(Models.Cuisine, { name: 'Indian' });
      await createNode(Models.User, { name: 'Test User', userName: 'test', password: 'test', email: 'test@email.com' });
      await createNode(Models.Recipe, { name: 'Chicken Test Recipe', instructions:  'Blah Blah Instructions' });
      await Promise.all([
        createRelationship({ model: Models.Recipe, params: { name: 'Chicken Test Recipe' } },
          { model: Models.User, params: { userName: 'test' } }, Relationships.postedBy),
        createRelationship({ model: Models.Recipe, params: { name: 'Chicken Test Recipe' } },
          { model: Models.Category, params: { name: 'Lunch' } }, Relationships.isOfCategory),
        createRelationship({ model: Models.Recipe, params: { name: 'Chicken Test Recipe' } },
          { model: Models.Cuisine, params: { name: 'Indian' } }, Relationships.isOfCuisine),
        createRelationship({ model: Models.Recipe, params: { name: 'Chicken Test Recipe' } },
          { model: Models.Ingredient, params: { name: 'Salt' } }, Relationships.hasIngredient,
          { measure: '1 tsp'}),
        createRelationship({ model: Models.Recipe, params: { name: 'Chicken Test Recipe' } },
          { model: Models.Ingredient, params: { name: 'Chicken' } }, Relationships.hasIngredient,
          { measure: '1 lb'})
      ])
    }
    catch (error) {
      console.log(error);
    }
});

  it('Gets all recipes', () => {
    return app.get('/api/recipes')
      .expect(200)
      .then(response => {
          expect(response.text).to.contain('Chicken Test Recipe');
      });
  });

  it('Gets the recipe by Id', () => {
    return findNode(Models.Recipe, { name: 'Chicken Test Recipe' })
      .then(recipe => {
        return app.get(`/api/recipes/${recipe.id}`)
          .expect(200)
          .then(response => {
            expect(response.text).to.contain('Chicken Test Recipe');
            expect(response.text).to.contain('Lunch');
            expect(response.text).to.contain('Indian');
            expect(response.text).to.contain('Salt');
            expect(response.text).to.contain('Chicken');
            expect(response.text).to.contain('Test User');
            expect(response.text).to.contain('Blah Blah Instructions');
          });
      })
  });

  it('Deletes recipe by id', () => {
    return findNode(Models.Recipe, { name: 'Chicken Test Recipe' })
      .then(recipe => {
        return app.delete(`/api/recipes/${recipe.id}`)
          .expect(204)
      });
  });

  it('Updates recipe for given Id', () => {
    return findNode(Models.Recipe, { name: 'Chicken Test Recipe' })
      .then(recipe => {
        return app.put(`/api/recipes/${recipe.id}`)
          .send({ instructions: 'Test Instructions Updated'})
          .expect(303)
      })
  });

  it('Creates recipe', () => {
    return findNode(Models.User, { userName: 'test' })
      .then(user => {
        return app.post('/api/recipes/')
          .send({ name: 'Test Recipe', instructions: 'Test Instructions', postedByUserId: user.id, 
            categoryName: 'Lunch', cuisineName: 'Indian', ingredients: '2 lb Chicken\n2 tsp Salt' })
          .expect(302)
      })
  });

});
