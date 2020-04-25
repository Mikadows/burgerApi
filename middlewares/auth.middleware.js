
class AuthMiddleware {

    static isAdmin(){
        return function (req, res, next) {
            // const user = {
            //     login: 'aymeric',
            //     email: 'aymeric.test@gmail.com',
            //     password: 'password',
            //     type: 'admin'
            // };
            if(req.user.type === 'admin'){
                next();
            }else{
                res.status(403).send();
            }
        }
    }

}

module.exports = AuthMiddleware;
