const bodyParser = require('body-parser');
const AuthMiddleware = require('../middlewares/auth.middleware');

module.exports = function(app) {

    /**
     * Apply the middleware for all routes bellow
     */
    app.use(AuthMiddleware.isPreparerOrAdmin)

    app.get('/preparer/orders', bodyParser.json(), async (req, res) => {
        //TODO : Get all orders
        res.status(501).end();
    });

    app.get('/preparer/order/:id', bodyParser.json(), async (req, res) => {
        //TODO : Get one order
        res.status(501).end();
    });

    app.post('/preparer/order/:id', bodyParser.json(), async (req, res) => {
        //TODO : process an order
        res.status(501).end();
    });


};
