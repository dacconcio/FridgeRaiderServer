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
};