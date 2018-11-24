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
  },
  reviewedBy: {
    type: 'relationship',
    relationship: 'REVIEWED_BY',
    direction: 'out',
    target: Models.User,
    properties: {
      rating: {
        type: 'number',
        required: true,
      },
      description: {
        type: 'string',
        required: true,
      },
    },
  },
  isOfCategory: {
    type: 'relationship',
    relationship: 'IS_OF_CATEGORY',
    direction: 'out',
    target: Models.Category,
  },
  isOfCuisine: {
    type: 'relationship',
    relationship: 'IS_OF_CUISINE',
    direction: 'out',
    target: Models.Cuisine,
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
  },
};