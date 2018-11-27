const expect = require('chai').expect;
const supertest = require('supertest');
const { sync, createNode, findNode, Models } = require('../db')
const app = supertest(require('../app'));

describe('User Routes - /api/users/', () => {

  beforeEach(() => {
    return sync()
      .then(() => {
        return Promise.all([
          createNode(Models.User, { name: 'Moe', userName: 'moe', password: 'moe', email: 'moe@email.com', isAdmin: false }),
          createNode(Models.User, { name: 'Curly', userName: 'curly', password: 'curly', email: 'curly@email.com', isAdmin: false }),
          createNode(Models.User, { name: 'Larry', userName: 'larry', password: 'larry', email: 'larry@email.com', isAdmin: false }),
       ])
    });
  }); 

  it('Gets all Users', () => {
    return app.get('/api/users')
      .expect(200)
      .then(response => {
          expect(response.text).to.contain('Moe');
          expect(response.text).to.contain('Curly');
          expect(response.text).to.contain('Larry');
      });
  });

  it('Gets the user by Id', () => {
    return findNode(Models.User, { name: 'Moe' })
      .then(user => {
        return app.get(`/api/users/${user.id}`)
          .expect(200)
          .then(response => {
            expect(response.text).to.contain('Moe');
            expect(response.text).to.not.contain('Curly');
            expect(response.text).to.not.contain('Larry');
          });
      })
  });

  it('Updates the user for given Id', () => {
    return findNode(Models.User, { name: 'Moe' })
      .then(user => {
        return app.put(`/api/users/${user.id}`)
          .send({ name: 'TestUser' })
          .expect(303)
      })
  });

  it('Creates user', () => {
    return app.post('/api/users/')
      .send({ name: 'Joe', userName: 'joe', password: 'joe', email: 'joe@email.com', isAdmin: false })
      .expect(302)
  });

});
