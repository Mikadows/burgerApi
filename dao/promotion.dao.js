'use strict';
const Promotion = require('../models').Promotion;

class PromotionDao {

    /**
     * @param promo {Promotion}
     * @returns {Promise<Promotion>}
     */
    static async savePromotion(promo) {
        await promo.save();
    }

    /**
     * @returns {Promise<Promotion[]>}
     */
    static async getAllPromotions() {
        return Promotion.find().populate('menu').populate('products');
    }

    /**
     * @param id {string}
     * @returns {Promise<Promotion|undefined>}
     */
    static async findById(id) {
        return Promotion.findOne({_id: id}).populate('menu').populate('products');
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
