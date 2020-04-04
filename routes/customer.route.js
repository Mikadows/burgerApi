const bodyParser = require('body-parser');
let OrderController = require('../controllers').OrderController;

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
        //TODO: Get all promotions
        res.status(501).end();
    });

};
