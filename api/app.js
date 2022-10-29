const initialize = require('./src/config/initialize'); initialize();
const cors = require('cors');
const express = require('express');
const server = require('./src/config/server');
const routes = require('./src/routes');
const app = express();
// so we can get auth  refresh token in frontend
// also send it 
const corsOptions = {
  exposedHeaders: ['x-auth-token', 'x-refresh-token'],
  allowedHeaders: ['x-auth-token', 'x-refresh-token', 'Content-Type']
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '5mb' }));
app.use('/api', routes);

module.exports = { server, app: server.start(app) }; // nedded in tests