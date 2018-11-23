const db = require('./db');
const app = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Listening on Port ${PORT}`));

const init = async() => {
  if (process.env.SYNC_DB) {
    console.log("Syncing Database...")
    await db.sync();
  }

  if (process.env.SEED_DB) {
    console.log("Seeding Database...")
    await db.seed();
  }
}

init();


