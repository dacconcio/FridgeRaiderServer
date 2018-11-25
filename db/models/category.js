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
};