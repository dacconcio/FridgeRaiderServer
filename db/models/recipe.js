const { Models } = require('./constants');

module.exports = {
  id: {
    primary: true,
    type: 'uuid',
    required: true, 
  },
  name: {
    type: 'string',
    required: true,
    unique: true,
    invalid: [''],
  },
  instructions: {
    type: 'string',
    required: true,
    invalid: [''],
  },
  imageUrl: {
    type: 'string',
  },
  videoUrl: {
    type: 'string',
  },
  postedBy: {
    type: 'relationship',
    relationship: 'POSTED_BY',
    direction: 'out',
    target: Models.User,
    eager: true
  },
  hasReview: {
    type: 'relationship',
    relationship: 'HAS_REVIEW',
    direction: 'out',
    target: Models.Review,
    eager: true
  },
  isOfCategory: {
    type: 'relationship',
    relationship: 'IS_OF_CATEGORY',
    direction: 'out',
    target: Models.Category,
    eager: true
  },
  isOfCuisine: {
    type: 'relationship',
    relationship: 'IS_OF_CUISINE',
    direction: 'out',
    target: Models.Cuisine,
    eager: true
  },
  hasIngredient: {
    type: 'relationship',
    relationship: 'HAS_INGREDIENT',
    direction: 'out',
    target: Models.Ingredient,
    properties: {
      measure: {
        type: 'string',
        allow: ['']
      }
    },
    eager: true
  },
};