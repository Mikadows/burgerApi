'use strict';
const Session = require('../models').Session;

class SessionDao {

    /**
     * @param session {Session}
     * @returns {Promise<Session>}
     */
    static async saveSession(session) {
        await session.save();
    }

    /**
     * @returns {Promise<Session[]>}
     */
    static async getAllSessions() {
        return Session.find().populate('user');
    }

    /**
     * @param id {string}
     * @returns {Promise<Session|undefined>}
     */
    static async findById(id) {
        return Session.findOne({_id: id}).populate('user');
    }

    /**
     * @param id {string}
     * @returns {Promise<Boolean>}
     */
    static async deleteById(id) {
        Session.deleteOne({_id: id}, (err) => {
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
        return Session.findOneAndUpdate({_id: id}, updates,{
            new: true //To return model after update
        });
    }
}

module.exports = SessionDao;
