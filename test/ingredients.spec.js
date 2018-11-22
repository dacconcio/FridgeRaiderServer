const expect = require('chai').expect;
const supertest = require('supertest');
const app = supertest(require('../app'));

describe('Ingredients Routes - /api/ingredients/', () => {

  it('Gets all Ingredients', () => {
    return app.get('/api/ingredients')
      .expect(200)
      .then(response => {
          expect(response.text).to.contain('Chicken');
      });
  });
});