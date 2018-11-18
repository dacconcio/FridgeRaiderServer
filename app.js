const express = require('express');
const app = express();

//Dummy Route - To test
app.get('/', (req, res, next) => {
    res.send("Hello World");
});

// error handling
app.use((err, req, res, next) => {
    console.error(err, typeof next)
    console.error(err.stack)
    res.status(err.status || 500).send(err.message || 'Internal server error.')
});

module.exports = app;