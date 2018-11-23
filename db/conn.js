const Neode = require('neode');
const neode = new Neode(process.env.DATABASE_URL, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD);

module.exports = neode;