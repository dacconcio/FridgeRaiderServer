const db = require('./db');
const app = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Listening on Port ${PORT}`));

if (process.env.SYNC_DB) {
  console.log("Syncing Database...")
  db.sync()
    .then(() => db.seed())
}


