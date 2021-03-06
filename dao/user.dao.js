'use strict';
const User = require('../models').User;
let mongoose = require('mongoose');
class UserDao {

    /**
     * @param user {User}
     * @returns {Promise<User>}
     */
    static async saveUser(user) {
        await user.save();
    }

    /**
     * @returns {Promise<User[]>}
     */
    static async getAllUsers() {
        return User.find().populate('sessions');
    }

    /**
     * @returns {Promise<Product[]>}
     */
    static async find(json){
        return User.find(json).exec();
    }

    /**
     * @param id {string}
     * @returns {Promise<User|undefined>}
     */
    static async findById(id) {
        if(mongoose.Types.ObjectId.isValid(id)) return User.findOne({_id: id}).populate('sessions');
        else undefined;
    }

    /**
     * @param id {string}
     * @returns {Promise<Boolean>}
     */
    static async deleteById(id) {
        User.deleteOne({_id: id}, (err) => {
            if (err) return false;
        });
        return true;
    }

    /**
     * @returns {Promise<User[]>}
     */
    static async findOne(json){
        return User.findOne(json).exec();
    }

    /**
     * Check if the user id is admin
     * @param id
     * @returns {boolean}
     */
    static async isAdmin(id){
        let UserExist = await UserDao.find({$and:[{type:{$eq:"admin"}},{_id: id}]});
        if(Array.isArray(UserExist) && UserExist.length) return true;
        else return false;
    }

    /**
     * Check if the user id is preparer or is admin
     * @param id
     * @returns {boolean}
     */
    static async isPreparerOrAdmin(id){
        const user = await UserDao.find({$or:[
                                                        {$and:[{type:{$eq:"admin"}},{_id: id}]},
                                                        {$and:[{type:{$eq:"preparer"}},{_id: id}]}
                                                    ]});
        if(Array.isArray(user) && user.length) return true;
        else return false;
    }

    /**
     *
     * @param id {string}
     * @param updates {json}
     * @returns {Promise<void>}
     */
    static async updateById(id, updates) {
        return User.findOneAndUpdate({_id: id}, updates,{
            new: true //To return model after update
        });
    }
}

module.exports = UserDao;
