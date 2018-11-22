const expect = require('chai').expect;
const supertest = require('supertest');
const app = supertest(require('../app'));

describe('Recipes Routes - /api/recipes/', () => {

  it('Gets all recipes', () => {
    return app.get('/api/recipes')
      .expect(200)
      .then(response => {
          expect(response.text).to.contain('Chicken');
      });
  });
});