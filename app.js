// Main application file

// Required libraries
const express = require('express');
const volleyball = require('volleyball');
const bodyParser = require('body-parser');

// Required files
const routerApi = require('./api/routes');

// App creation
const app = express();
const PORT = 8585;

// Middleware

// Logging
app.use(volleyball);
// Parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Routers
app.use('/api', routerApi);

app.use((req, res, next) => {
  res.send('Hello');
});

// Start the server
app.listen(PORT, () => {
    console.log(`We're online on port ${PORT}`);
});

// Error logging middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).send(err.message || 'Internal server error');
});
