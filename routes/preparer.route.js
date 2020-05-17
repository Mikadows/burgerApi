const bodyParser = require('body-parser');
const AuthMiddleware = require('../middlewares/auth.middleware');
const OrderController = require('../controllers').OrderController;

module.exports = function(app) {

    /**
     * Apply the middleware for all routes bellow
     */
    //app.use(AuthMiddleware.isPreparerOrAdmin);

    app.get('/preparer/orders', AuthMiddleware.isPreparerOrAdmin , OrderController.orders_get_all);

    app.get('/preparer/order/:id', AuthMiddleware.isPreparerOrAdmin ,bodyParser.json(), async (req, res) => {
        //TODO : Get one order
        res.status(501).end();
    });

    app.post('/preparer/order/:id', AuthMiddleware.isPreparerOrAdmin ,bodyParser.json(), async (req, res) => {
        //TODO : process an order
        res.status(501).end();
    });


};
