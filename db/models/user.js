module.exports = {
  id: {
    primary: true,
    type: 'uuid',
    required: true, 
  },
  name: {
    type: 'string',
    required: true,
    invalid: [''],
  },
  userName: {
    type: 'string',
    required: true,
    unique: true,
    invalid: [''],
  },
  password: {
    type: 'string',
    required: true,
    invalid: [''],
  },
  email: {
    type: 'string',
    required: true,
    unique: true,
    email: true,
    invalid: [''],
  },
  hasWritten: {
    type: 'relationship',
    relationship: 'HAS_WRITTEN',
    direction: 'out',
    target: 'Review',
    eager: true
  },
  hasSaved: {
    type: 'relationship',
    relationship: 'HAS_SAVED',
    direction: 'out',
    target: 'Recipe',
    eager: true
  },
  hasPosted: {
    type: 'relationship',
    relationship: 'HAS_POSTED',
    direction: 'out',
    target: 'Recipe',
    eager: true
  },
};