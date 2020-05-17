'use strict';
const Menu = require('../models').Menu;
let mongoose = require('mongoose');


class MenuDao {

    /**
     * @param Menu {Menu}
     * @returns {Promise<Menu>}
     */
    static async saveMenu(Menu) {
        await Menu.save();
    }

    /**
     * @returns {Promise<Product[]>}
     */
    static async find(json){
        return Menu.find(json).exec();
    }

    /**
     * @returns {Promise<Menu[]>}
     */
    static async getAllMenus() {
        return Menu.find();
    }

    /**
     * @returns {Promise<Product[]>}
     */
    static async findOne(json){
        return Menu.findOne(json).exec();
    }
    /**
     * @param id {string}
     * @returns {Promise<Menu|undefined>}
     */
    static async findById(id) {
        if(mongoose.Types.ObjectId.isValid(id)) return Menu.findOne({_id: id}).populate('products');
        else undefined;
    }

    /**
     * @param id {string}
     * @returns {Promise<Boolean>}
     */
    static async deleteById(id) {
        Menu.deleteOne({_id: id}, (err) => {
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
        return Menu.findOneAndUpdate({_id: id}, updates,{
            new: true //To return model after update
        });
    }
}

module.exports = MenuDao;
