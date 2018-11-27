const { Models } = require('./constants');

module.exports = {
  id: {
    primary: true,
    type: 'uuid',
    required: true, 
  },
  name: {
    type: 'string',
    unique: true,
    required: true,
    invalid: [''],
  },
  tags: {
    type: 'string',
    allow: ['']
  },
  isOfIngredientType: {
    type: 'relationship',
    relationship: 'IS_OF_INGREDIENT_TYPE',
    direction: 'out',
    target: Models.IngredientType,
  },
};