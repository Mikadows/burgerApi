'use strict';
const User = require('../models').User;

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
     * @param id {string}
     * @returns {Promise<User|undefined>}
     */
    static async findById(id) {
        return User.findOne({_id: id}).populate('sessions');
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
