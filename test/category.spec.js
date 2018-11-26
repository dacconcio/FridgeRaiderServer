const expect = require('chai').expect;
const supertest = require('supertest');
const { sync, createNode, Models } = require('../db')
const app = supertest(require('../app'));

describe('Category Routes - /api/categories/', () => {

  beforeEach(() => {
    return sync()
      .then(() => {
        return Promise.all([
          createNode(Models.Category, { name: "Breakfast" }),
          createNode(Models.Category, { name: "Lunch" }),
          createNode(Models.Category, { name: "Dinner" }),
       ]);
    });
  }); 

  it('Gets all Categories', () => {
    return app.get('/api/categories')
      .expect(200)
      .then(response => {
          expect(response.text).to.contain('Breakfast');
          expect(response.text).to.contain('Lunch');
          expect(response.text).to.contain('Dinner');
      });
  });
});
