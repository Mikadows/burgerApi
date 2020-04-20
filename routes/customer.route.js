const bodyParser = require('body-parser');
const OrderController = require('../controllers').OrderController;
const ProductsController = require('../controllers').ProductController;
const MenuController = require('../controllers').MenuController;

module.exports = function(app) {

    app.post('/customer/order', bodyParser.json(), OrderController.create_order);

    app.get('/products', ProductsController.products_get_all);
    app.get('/product/:productId', ProductsController.get_product_by_id);

    app.get('/menus', MenuController.menus_get_all);
    app.get('/menu/:menuId', MenuController.get_menu_by_id);

    app.get('/customer/promotions', bodyParser.json(), async (req, res) => {
        //TODO: Get all promotions
        res.status(501).end();
    });

};
