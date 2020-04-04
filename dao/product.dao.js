'use strict';
const Product = require('../models').Product;

class ProductDao {

    /**
     * @param Product {Product}
     * @returns {Promise<Product>}
     */
    static async saveProduct(Product) {
        await Product.save();
    }

    /**
     * @returns {Promise<Product[]>}
     */
    static async findOne(json){
        return Product.findOne(json).exec();
    }

    /**
     * @returns {Promise<Product[]>}
     */
    static async getAllProducts() {
        return Product.find();
    }

    /**
     * @param id {string}
     * @returns {Promise<Product|undefined>}
     */
    static async findById(id) {
        return Product.findOne({_id: id});
    }

    /**
     * @param id {string}
     * @returns {Promise<Boolean>}
     */
    static async deleteById(id) {
        Product.deleteOne({_id: id}, (err) => {
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
        return Product.findOneAndUpdate({_id: id}, updates,{
            new: true //To return model after update
        });
    }
}

module.exports = ProductDao;
