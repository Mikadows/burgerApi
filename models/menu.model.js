'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuSchema = new Schema({
    name: String,
    price: Number,
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }]
});

module.exports = mongoose.model('Menu', menuSchema);
