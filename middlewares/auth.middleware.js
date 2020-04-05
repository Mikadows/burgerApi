
class AuthMiddleware {

    static isAdmin(){
        return function (req, res, next) {
            const user = {
                login: 'aymeric',
                email: 'aymeric.test@gmail.com',
                password: 'password',
                type: 'admin'
            };
            console.log(user.type);
            if(req === 'admin'){
                console.log('TEST');
                next();
            }else{
                res.status(403).send();
            }
            next();
        }
    }

}

module.exports = AuthMiddleware;
