require('dotenv').config();
const express = require('express');
const routes = require('./routes');

const app = express();

routes(app);

app.listen(process.env.API_PORT, () => console.log(`BurgerAPI Started on port ${process.env.API_PORT}...`));
