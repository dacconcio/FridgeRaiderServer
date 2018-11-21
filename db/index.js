const Neode = require('neode');
const instance = new Neode(process.env.DATABASE_URL, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD);

const sync = () => {

  return new Promise((resolve, reject) => {

    // Delete current data
    instance.cypher(
      `MATCH (n) 
      OPTIONAL MATCH (n)-[r]-()
      WITH n,r LIMIT 50000
      DELETE n,r
      RETURN count(n) as deletedNodesCount`
    ).then(() => {

      // Create Schemas
      instance.model('User', require('./models/user'));
      instance.model('MealType', require('./models/mealType'));
      instance.model('Cuisine', require('./models/cuisine'));
      resolve();
    })
  });
}

const seed = () => {
  return Promise.all([
    instance.create('User', { name: 'T', userName: 'a', password: 'abc', email: 'abc@email.com' }),
    instance.create('MealType', { name: 'Breakfast' }),
    instance.create('Cuisine', { name: 'Indian' }),
    instance.create('Review', { rating: 5, description: 'Excellent' }),
  ])
}

module.exports = {
  //instance,
  sync,
  seed,
}