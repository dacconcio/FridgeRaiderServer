const expect = require('chai').expect;
const supertest = require('supertest');
const { sync, createNode, findNode, Models } = require('../db')
const app = supertest(require('../app'));

describe('Category Routes - /api/categories/', () => {

  beforeEach(() => {
    return sync()
      .then(() => {
        return Promise.all([
          createNode(Models.Category, { name: "Breakfast" }),
          createNode(Models.Category, { name: "Lunch" }),
          createNode(Models.Category, { name: "Dinner" }),
       ])
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

  it('Gets the category by Id', () => {
    return findNode(Models.Category, { name: "Breakfast" })
      .then(category => {
        return app.get(`/api/categories/${category.id}`)
          .expect(200)
          .then(response => {
            expect(response.text).to.contain('Breakfast');
            expect(response.text).to.not.contain('Lunch');
            expect(response.text).to.not.contain('Dinner');
          });
      })
  });

  it('Updates the category for given Id', () => {
    return findNode(Models.Category, { name: "Breakfast" })
      .then(category => {
        return app.put(`/api/categories/${category.id}`)
          .send({ name: "Dessert" })
          .expect(303)
      })
  });

  it('Creates category', () => {
    return app.post('/api/categories/')
      .send({ name: "Dessert" })
      .expect(302)
  });

});
