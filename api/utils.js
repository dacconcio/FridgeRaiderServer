const fs = require('fs');
const path = require('path');
const jwt = require('jwt-simple');

const isAuthenticated = (req, res, next) => {
    
  const token = req.headers.authorization;
  if(!token) {
    return next();
  }

  let id;
  try {
    id = jwt.decode(token, process.env.JWT_SECRET).id;
  }
  catch(ex) {
    return next({ status: 401 });
  }

  //TO DO - Get it from DB when ready
  const users = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'json/users.json'))).users;
  const user = users.find(user => user.id === id);
  req.user = user;
  next();
  
}

module.exports = { isAuthenticated }