'use strict';
require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const initDbConnection = require('./dao/connection-manager');
const app = express();

initDbConnection();
routes(app);

app.listen(process.env.API_PORT, () => console.log(`BurgerAPI Started on port ${process.env.API_PORT}...`));

