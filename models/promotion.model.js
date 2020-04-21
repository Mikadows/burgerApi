'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const promotionSchema = new Schema({
    name: String,
    menus: [{
        type: Schema.Types.ObjectId,
        ref: 'Menu'
    }],
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],
    percentReduction: Number
});

module.exports = mongoose.model('Promotion', promotionSchema);
