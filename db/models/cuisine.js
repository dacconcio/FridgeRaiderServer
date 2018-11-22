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
};