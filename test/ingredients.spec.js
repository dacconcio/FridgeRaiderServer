const expect = require('chai').expect;
const supertest = require('supertest');
const { sync, createNode, findNode, Models } = require('../db')
const app = supertest(require('../app'));

describe('Ingredients Routes - /api/ingredients/', () => {

  beforeEach(() => {
    return sync()
      .then(() => {
        return Promise.all([
          createNode(Models.Ingredient, { name: 'Chicken', tags: 'whole chicken,chicken,poultry,meat,animal product' }),
          createNode(Models.Ingredient, { name: 'Turkey Mince', tags: 'whole turkey,turkey,poultry,meat,animal product' }),
          createNode(Models.Ingredient, { name: 'Carrots', tags: 'carrot,root vegetable,vegetable' }),
       ]);
    });
  }); 

  it('Gets all Ingredients', () => {
    return app.get('/api/ingredients')
      .expect(200)
      .then(response => {
          expect(response.text).to.contain('Chicken');
          expect(response.text).to.contain('Turkey');
          expect(response.text).to.contain('Carrots');
      });
  });

  it('Gets the ingredient by Id', () => {
    return findNode(Models.Ingredient, { name: "Chicken" })
      .then(ingredient => {
        return app.get(`/api/ingredients/${ingredient.id}`)
          .expect(200)
          .then(response => {
            expect(response.text).to.contain('Chicken');
            expect(response.text).to.not.contain('Turkey');
            expect(response.text).to.not.contain('Carrots');
          });
      })
  });

  it('Updates the ingredient tags for given Id', () => {
    return findNode(Models.Ingredient, { name: "Chicken" })
      .then(ingredient => {
        return app.put(`/api/ingredients/${ingredient.id}`)
          .send({ tags: "test" })
          .expect(303)
      })
  });

});
