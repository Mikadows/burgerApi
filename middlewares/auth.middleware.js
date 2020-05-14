const SessionDao = require('../dao/session.dao');
class AuthMiddleware {

    static async isAdmin(req, res, next){
        let token = req.headers['x-access-token'] || false;
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

            if(!await SessionDao.UserIsAdmin(token)){
                res.status(401).json({
                    status: 401,
                    message:"Your Id is not an admin, Unauthorized"
                }).end();
                throw new Error("Your Id is not an admin, Unauthorized");
            }
            return next();
    }

}

module.exports = AuthMiddleware;
