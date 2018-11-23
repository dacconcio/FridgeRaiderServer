const User = 'User';
const Category = 'Category';
const Cuisine = 'Cuisine';
const Review = 'Review';
const IngredientType = 'IngredientType';
const Ingredient = 'Ingredient';
const Recipe = 'Recipe';
const hasWritten = 'hasWritten';
const hasSaved = 'hasSaved';
const hasPosted = 'hasPosted';
const isOfIngredientType = 'isOfIngredientType';
const postedBy = 'postedBy';
const hasReview = 'hasReview';
const isOfCategory = 'isOfCategory';
const isOfCuisine = 'isOfCuisine';
const hasIngredient = 'hasIngredient';
const name = 'name';


module.exports = {
  Models: {
    User,
    Category,
    Cuisine,
    Review,
    IngredientType,
    Ingredient,
    Recipe
  },
  Relationships: {
    hasWritten,
    hasSaved,
    hasPosted,
    isOfIngredientType,
    postedBy,
    hasReview,
    isOfCategory,
    isOfCuisine,
    hasIngredient
  },
  Properties: {
    name
  }
}
