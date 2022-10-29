const routeManager = require('./manager');
const scriptManager = require('./script');
const express = require('express');
const app = express.Router();
app.all('/script/:websiteId', scriptManager); // ! url may change later
app.all('/:module/:action', routeManager);
module.exports = app;