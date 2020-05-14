const SessionDao = require('../dao/session.dao');
class AuthMiddleware {

    static isAdmin(req, res, next){
        let token = req.headers['x-access-token'] || false;

        return Promise.resolve().then(() => {
            if(!token) {
                res.status(401).json({
                    status: 401,
                    message:"Not an admin token, Unauthorized"
                }).end();
                throw new Error("Not an admin token, Unauthorized");
            }

            //SessionDao.

        })
    }

}

module.exports = AuthMiddleware;
