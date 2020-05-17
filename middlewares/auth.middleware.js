const SessionDao = require('../dao/session.dao');
class AuthMiddleware {

    /**
     * Check if the token is valid or not
     * @param req
     * @param res
     * @returns {Promise<*|string[]|string|boolean>}
     */
    static async checkIfTokenValid(req, res){
        const token = req.headers['x-access-token'] || false;
        if(!token) {
            res.status(401).json({
                status: 401,
                message:"You have to send a token, Unauthorized"
            }).end();
            throw new Error("You have to send a token, Unauthorized");
        }

        if(!await SessionDao.tokenIsValid(token)) {
            res.status(401).json({
                status: 401,
                message:"Your Session is not active anymore or doesn't exist, Unauthorized"
            }).end();
            throw new Error("Your Session is not active anymore or doesn't exist, Unauthorized");
        }
        return token;
    }

    /**
     * Middleware to check if user is admin or not
     * @param req
     * @param res
     * @param next
     * @returns {Promise<*>}
     */
    static async isAdmin(req, res, next){
            const token = await AuthMiddleware.checkIfTokenValid(req, res);

            if(!await SessionDao.UserIsAdmin(token)){
                res.status(401).json({
                    status: 401,
                    message:"Your Id is not an admin, Unauthorized"
                }).end();
                throw new Error("Your Id is not an admin, Unauthorized");
            }
            return next();
    }

    /**
     * Middleware to check if user is admin or preparer
     * @param req
     * @param res
     * @param next
     * @returns {Promise<*>}
     */
    static async isPreparerOrAdmin(req, res, next){
        const token = await AuthMiddleware.checkIfTokenValid(req, res);

        if(!await SessionDao.userIsPreparerOrAdmin(token)){
            res.status(401).json({
                status: 401,
                message:"Your not an admin or preparer, Unauthorized"
            }).end();
            throw new Error("Your not an admin or preparer, Unauthorized");
        }
        return next();
    }



}

module.exports = AuthMiddleware;
