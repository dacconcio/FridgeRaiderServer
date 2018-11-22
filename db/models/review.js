module.exports = {
  id: {
      primary: true,
      type: 'uuid',
      required: true, 
  },
  rating: {
      type: 'number',
      required: true,
  },
  description: {
      type: 'string',
      required: true,
  },
};