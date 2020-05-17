'use strict';
const Order = require('../models').Order;
let mongoose = require('mongoose');

class OrderDao {

    /**
     * @param Order {Order}
     * @returns {Promise<Order>}
     */
    static async saveOrder(Order) {
        await Order.save();
    }

    /**
     * @returns {Promise<Order[]>}
     */
    static async find(json){
        return Order.find(json).exec();
    }


    /**
     * @returns {Promise<Order[]>}
     */
    static async findOne(json){
        return Order.findOne(json).exec();
    }

    /**
     * @returns {Promise<Menu[]>}
     */
    static async getAllOrders() {
        return Order.find();
    }

    /**
     * @param id {string}
     * @returns {Promise<Order|undefined>}
     */
    static async findById(id) {
        if(mongoose.Types.ObjectId.isValid(id)) return Order.findOne({_id: id});
        else undefined;
    }

    /**
     * @param id {string}
     * @returns {Promise<Boolean>}
     */
    static async deleteById(id) {
        Order.deleteOne({_id: id}, (err) => {
            if (err) return false;
        });
        return true;
    }

    /**
     *
     * @param id {string}
     * @param updates {json}
     * @returns {Promise<void>}
     */
    static async updateById(id, updates) {
        return Order.findOneAndUpdate({_id: id}, updates,{
            new: true //To return model after update
        });
    }
}

module.exports = OrderDao;
