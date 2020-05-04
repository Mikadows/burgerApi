'use strict';
require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const initDbConnection = require('./dao/connection-manager');
const app = express();

initDbConnection();
routes(app);

const API_PORT = process.env.API_PORT || 3000;
app.listen(process.env.API_PORT, () => console.log(`BurgerAPI Started on port ${API_PORT}...`));
