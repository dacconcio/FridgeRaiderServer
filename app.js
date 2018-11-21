const express = require('express');
const app = express();

app.use(express.json());
app.use("/api", require('./api'));

app.get('/', (req, res, next) => {
    res.send("Fridge Raider Server Running....");
});

// error handling
app.use((err, req, res, next) => {
    console.error(err, typeof next)
    console.error(err.stack)
    res.status(err.status || 500).send(err.message || 'Internal server error.')
});

module.exports = app;