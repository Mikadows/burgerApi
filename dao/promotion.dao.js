'use strict';
const Promotion = require('../models').Promotion;
const mongoose = require('mongoose');

class PromotionDao {

    /**
     *
     * @param promo
     * @returns {Promise<Promotion>}
     */
    static savePromotion(promo) {
        return Promotion.create(promo, (err, res) => {
            if (err) return false;

            console.log('2' + res);
            return res;
        });
    }

    /**
     * @returns {Promise<Promotion[]>}
     */
    static async getAllPromotions() {
        return Promotion.find({}).populate('menu').populate('products');
    }

    /**
     * @returns {Promise<Product[]>}
     */
    static async find(json){
        return Promotion.find(json).exec();
    }

    /**
     * @param id {string}
     * @returns {Promise<Promotion|undefined>}
     */
    static async findById(id) {
        if(mongoose.Types.ObjectId.isValid(id)) return Promotion.findOne({_id: id});
        else undefined;
    }

    /**
     * @param json
     * @returns {Promise<AggregationCursor|RegExpExecArray>}
     */
    static async findOne(json){
        return Promotion.findOne(json).exec();
    }

    /**
     * @param id {string}
     * @returns {Promise<Boolean>}
     */
    static async deleteById(id) {
        Promotion.deleteOne({_id: id}, (err) => {
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
        return Promotion.findOneAndUpdate({_id: id}, updates,{
            new: true //To return model after update
        });
    }
}

module.exports = PromotionDao;
