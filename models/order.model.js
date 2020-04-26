'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    totalPrice: {
        type: Number,
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],
    menus: [{
        type: Schema.Types.ObjectId,
        ref: 'Menu'
    }]
});

module.exports = mongoose.model('Order', orderSchema);