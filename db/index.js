const fs = require('fs');
const path = require('path');
const faker = require('faker');
const Neode = require('neode');
const { Models, Relationships, Properties } = require('./models/constants')
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

      // Create Schemas and Relationships
      instance.model(Models.User, require('./models/user'));
      instance.model(Models.Category, require('./models/category'));
      instance.model(Models.Cuisine, require('./models/cuisine'));
      instance.model(Models.Review, require('./models/review'));
      instance.model(Models.IngredientType, require('./models/ingredientType'));
      instance.model(Models.Ingredient, require('./models/ingredient'));
      instance.model(Models.Recipe, require('./models/recipe'));

      resolve();

    }).catch(error => {
      console.log(error);
      reject();
    })
  });
}

const seed = async () => {
  try {
    //Seed Users
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'json/users.json'))).users;
    const [ admin, ...rest ] = await Promise.all(
      users.map(user => 
        instance.create(Models.User, { name: user.name, userName: user.userName, password: user.password, email: user.email })
      ));

    //Seed Ingredients
    const ingredients = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'json/ingredientsAndTypes.json'))).ingredients;
    for(let i = 0; i < ingredients.length; i++) {
      const tags = ingredients[i].tags && ingredients[i].tags.length ? ingredients[i].tags : '';
      ingredient = await instance.create(Models.Ingredient, { name: ingredients[i].name, tags });
      const type = ingredients[i].type ? ingredients[i].type : 'Unknown'
      let ingredientType = await instance.first(Models.IngredientType, Properties.name, type);
      if(!ingredientType) {
        ingredientType = await instance.create(Models.IngredientType, { name: type });
      }
      await ingredient.relateTo(ingredientType, Relationships.isOfIngredientType);
    }

    //Seed Recipes
    const recipes = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'json/recipes.json'))).recipes;
    for(let i = 0; i < recipes.length; i++) {
        const review = await instance.create(Models.Review, { 
          rating: faker.random.number({ min: 1, max: 5 }), 
          description: faker.lorem.paragraph() 
        });

        const index = faker.random.number({ min: 0, max: 2 });
        await rest[index].relateTo(review, Relationships.hasWritten);
        //Check if need review (writtenBy) user?

        await createRecipe(recipes[i], admin, review);
    }
  } catch(error) {
      console.log(error);
  }
}

const createRecipe = async(recipe, postedByUser, review) => {
  const createdRecipe = await instance.create(Models.Recipe, 
    { name: recipe.name, 
      instructions: recipe.instructions, 
      imageUrl: recipe.image, 
      videoUrl: recipe.video
    });
  
  await createdRecipe.relateTo(review, Relationships.hasReview);  

  await createdRecipe.relateTo(postedByUser, Relationships.postedBy);
  //Check if need: await postedByUser.relateTo(createdRecipe, 'hasPosted');

  let category = await instance.first(Models.Category, Properties.name, recipe.category);
  if(!category) {
    category = await instance.create(Models.Category, { name: recipe.category });
  }
  await createdRecipe.relateTo(category, Relationships.isOfCategory);

  let cuisine = await instance.first(Models.Cuisine, Properties.name, recipe.area);
  if(!cuisine) {
    cuisine = await instance.create(Models.Cuisine, { name: recipe.area });
  }
  await createdRecipe.relateTo(cuisine, Relationships.isOfCuisine);

  for(let i = 0; i < recipe.ingredients.length; i++) {
    let ingredient = await instance.first(Models.Ingredient, Properties.name, recipe.ingredients[i].name);
    if(ingredient) {
      const measure = recipe.ingredients[i].measure ? recipe.ingredients[i].measure : '';
      await createdRecipe.relateTo(ingredient, Relationships.hasIngredient, { measure });
    }
    else {
      console.log(`Ingredient Not Found: ${recipe.ingredients[i].name}`)
    }
  }
}

module.exports = {
  instance,
  sync,
  seed,
}