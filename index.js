'use strict';
require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const initDbConnection = require('./dao/connection-manager');
const app = express();

const daos = require('./dao');
const UserDAO = daos.UserDAO;

initDbConnection();
// routes(app);


const users = UserDAO.getAllUsers();
console.log(JSON.stringify(users));





app.listen(process.env.API_PORT, () => console.log(`BurgerAPI Started on port ${process.env.API_PORT}...`));
