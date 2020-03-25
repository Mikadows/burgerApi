'use strict';
const mongoose = require('mongoose');

module.exports = async function () {
    await mongoose.connect(process.env.MONGODB_ADDON_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    });
    console.log('The connection with MongoDB is established...');
};
