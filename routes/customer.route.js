const bodyParser = require('body-parser');
const Controllers = require('../controllers');
const OrderController = Controllers.OrderController;
const PromotionController = Controllers.PromotionController;

module.exports = function(app) {

    app.post('/customer/order', bodyParser.json(), OrderController.create_order);

    app.get('/customer/products', bodyParser.json(), async (req, res) => {
        //TODO: Get all products
        res.status(501).end();
    });

    app.get('/customer/menus', bodyParser.json(), async (req, res) => {
        //TODO: Get all menus
        res.status(501).end();
    });

    app.get('/customer/promotions', bodyParser.json(), async (req, res) => {
        const promotions = PromotionController.getAll();

        if (PromotionController.isEmpty(promotions)) {
            res.status(204).end();
        } else {
            res.status(200).json(promotions);
        }


    });

};
