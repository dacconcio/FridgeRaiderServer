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
    const users = JSON.parse(fs.readFileSync('users.json')).users;

    users.find(user => user.id === id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(next);
  }

  module.exports = { isAuthenticated }