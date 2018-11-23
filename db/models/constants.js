const User = 'User';
const Category = 'Category';
const Cuisine = 'Cuisine';
const Review = 'Review';
const IngredientType = 'IngredientType';
const Ingredient = 'Ingredient';
const Recipe = 'Recipe';
const hasWritten = 'hasWritten';
const HAS_WRITTEN = 'HAS_WRITTEN';
const hasSaved = 'hasSaved';
const HAS_SAVED = 'HAS_SAVED';
const hasPosted = 'hasPosted';
const HAS_POSTED = 'HAS_POSTED';
const isOfIngredientType = 'isOfIngredientType';
const postedBy = 'postedBy';
const POSTED_BY = 'POSTED_BY';
const hasReview = 'hasReview';
const HAS_REVIEW = 'HAS_REVIEW';
const isOfCategory = 'isOfCategory';
const IS_OF_CATEGORY = 'IS_OF_CATEGORY';
const isOfCuisine = 'isOfCuisine';
const IS_OF_CUISINE = 'IS_OF_CUISINE';
const hasIngredient = 'hasIngredient';
const HAS_INGREDIENT = 'HAS_INGREDIENT';
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
    HAS_WRITTEN,
    hasSaved,
    HAS_SAVED,
    hasPosted,
    HAS_POSTED,
    isOfIngredientType,
    postedBy,
    POSTED_BY,
    hasReview,
    HAS_REVIEW,
    isOfCategory,
    IS_OF_CATEGORY,
    isOfCuisine,
    IS_OF_CUISINE,
    hasIngredient,
    HAS_INGREDIENT
  },
  Properties: {
    name
  }
}
