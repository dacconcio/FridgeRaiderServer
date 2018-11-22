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
    target: 'User',
    eager: true
  },
  hasReview: {
    type: 'relationship',
    relationship: 'HAS_REVIEW',
    direction: 'out',
    target: 'Review',
    eager: true
  },
  isOfCategory: {
    type: 'relationship',
    relationship: 'IS_OF_CATEGORY',
    direction: 'out',
    target: 'Category',
    eager: true
  },
  isOfCuisine: {
    type: 'relationship',
    relationship: 'IS_OF_CUISINE',
    direction: 'out',
    target: 'Cuisine',
    eager: true
  },
  hasIngredient: {
    type: 'relationship',
    relationship: 'HAS_INGREDIENT',
    direction: 'out',
    target: 'Ingredient',
    properties: {
      measure: {
        type: 'string',
        allow: ['']
      }
    },
    eager: true
  },
};