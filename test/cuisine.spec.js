const expect = require('chai').expect;
const supertest = require('supertest');
const { sync, createNode, findNode, Models } = require('../db')
const app = supertest(require('../app'));

describe('Cuisine Routes - /api/cuisine/', () => {

  beforeEach(() => {
    return sync()
      .then(() => {
        return Promise.all([
          createNode(Models.Cuisine, { name: "Indian" }),
          createNode(Models.Cuisine, { name: "American" }),
          createNode(Models.Cuisine, { name: "Mexican" }),
       ])
    });
  }); 

  it('Gets all Cuisine', () => {
    return app.get('/api/cuisine')
      .expect(200)
      .then(response => {
          expect(response.text).to.contain('Indian');
          expect(response.text).to.contain('American');
          expect(response.text).to.contain('Mexican');
      });
  });

  it('Gets the cuisine by Id', () => {
    return findNode(Models.Cuisine, { name: "Indian" })
      .then(cuisine => {
        return app.get(`/api/cuisine/${cuisine.id}`)
          .expect(200)
          .then(response => {
            expect(response.text).to.contain('Indian');
            expect(response.text).to.not.contain('American');
            expect(response.text).to.not.contain('Mexican');
          });
      })
  });

  it('Updates the cuisine for given Id', () => {
    return findNode(Models.Cuisine, { name: "Indian" })
      .then(cuisine => {
        return app.put(`/api/cuisine/${cuisine.id}`)
          .send({ name: "Italian" })
          .expect(303)
      })
  });

  it('Creates cuisine', () => {
    return app.post('/api/cuisine/')
      .send({ name: "French" })
      .expect(302)
  });

});
