const fs = require('fs');
const path = require('path');
const faker = require('faker');
const neode = require('./conn');
const { Models, Relationships, Properties } = require('./models/constants')

const sync = () => {

  return new Promise((resolve, reject) => {

    // Delete current data
    neode.cypher(
      `MATCH (n) 
      OPTIONAL MATCH (n)-[r]-()
      WITH n,r LIMIT 50000
      DELETE n,r
      RETURN count(n) as deletedNodesCount`
    ).then(() => {

      // Create Schemas and Relationships
      neode.model(Models.User, require('./models/user'));
      neode.model(Models.Category, require('./models/category'));
      neode.model(Models.Cuisine, require('./models/cuisine'));
      neode.model(Models.IngredientType, require('./models/ingredientType'));
      neode.model(Models.Ingredient, require('./models/ingredient'));
      neode.model(Models.Recipe, require('./models/recipe'));

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
        neode.create(Models.User, { name: user.name, userName: user.userName, password: user.password, email: user.email })
      ));

    //Seed Ingredients
    const ingredients = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'json/ingredientsAndTypes.json'))).ingredients;
    for(let i = 0; i < ingredients.length; i++) {
      const tags = ingredients[i].tags && ingredients[i].tags.length ? ingredients[i].tags : '';
      ingredient = await neode.create(Models.Ingredient, { name: ingredients[i].name, tags });
      const type = ingredients[i].type ? ingredients[i].type : 'Unknown'
      let ingredientType = await neode.first(Models.IngredientType, Properties.name, type);
      if(!ingredientType) {
        ingredientType = await neode.create(Models.IngredientType, { name: type });
      }
      await ingredient.relateTo(ingredientType, Relationships.isOfIngredientType);
    }

    //Seed Recipes
    const recipes = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'json/recipes.json'))).recipes;
    console.log(`Recipes Count: ${recipes.length}`);
    console.log(`Recipes to upload: ${process.env.NO_OF_RECIPES_TO_UPLOAD}`)
    for(let i = 0; i < process.env.NO_OF_RECIPES_TO_UPLOAD; i++) {
        const review =  { 
          rating: faker.random.number({ min: 1, max: 5 }), 
          description: faker.lorem.paragraph() 
        };

        const index = faker.random.number({ min: 0, max: 2 });
        await createRecipe(recipes[i], admin, review, rest[index]);
    }
  } catch(error) {
      console.log(error);
  }
}

const createRecipe = async(recipe, postedByUser, review, reviewedBy) => {
  const createdRecipe = await neode.create(Models.Recipe, 
    { name: recipe.name, 
      instructions: recipe.instructions, 
      imageUrl: recipe.image, 
      videoUrl: recipe.video
    });
  
  await createdRecipe.relateTo(reviewedBy, Relationships.reviewedBy, review);  
  await createdRecipe.relateTo(postedByUser, Relationships.postedBy);
  await postedByUser.relateTo(createdRecipe, Relationships.hasPosted);

  let category = await neode.first(Models.Category, Properties.name, recipe.category);
  if(!category) {
    category = await neode.create(Models.Category, { name: recipe.category });
  }
  await createdRecipe.relateTo(category, Relationships.isOfCategory);

  let cuisine = await neode.first(Models.Cuisine, Properties.name, recipe.area);
  if(!cuisine) {
    cuisine = await neode.create(Models.Cuisine, { name: recipe.area });
  }
  await createdRecipe.relateTo(cuisine, Relationships.isOfCuisine);

  for(let i = 0; i < recipe.ingredients.length; i++) {
    let ingredient = await neode.first(Models.Ingredient, Properties.name, recipe.ingredients[i].name);
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
  sync,
  seed
}