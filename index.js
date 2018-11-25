const db = require('./db');
const app = require('./app');
const PORT = process.env.PORT || 3000;

const init = async() => {
  if (process.env.SYNC_DB) {
    console.log("Syncing and Seeding Database...");
    await db.sync();
    await db.seed();
    console.log("Syncing and Seeding Done");
  }
}

app.listen(PORT, () => console.log(`Listening on Port ${PORT}`));
init();



