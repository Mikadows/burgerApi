const bodyParser = require('body-parser');
const UserController = require('../controllers').UserController;


module.exports = function(app) {

    /**
     * Authentication routes
     */

    app.post('/auth/subscribe', bodyParser.json(), UserController.subscribe);

    app.post('/auth/login', bodyParser.json(), UserController.login);

    app.get('/', async (req, res) => {
       res.status(200).json({ message: "Welcome to BurgerAPI"});
    });

    app.delete('/auth/logout/:token',  UserController.logout);

};
