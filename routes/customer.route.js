const bodyParser = require('body-parser');

module.exports = function(app) {

    app.post('/customer/order', bodyParser.json(), async (req, res) => {
        //TODO: make an order
        res.status(501).end();
    });

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
