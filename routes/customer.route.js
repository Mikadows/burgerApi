const bodyParser = require('body-parser');

const Controllers = require('../controllers');
const ProductsController = Controllers.ProductController;
const OrderController = Controllers.OrderController;
const PromotionController = Controllers.PromotionController;
const MenuController = Controllers.MenuController;

module.exports = function(app) {

    app.post('/customer/order', bodyParser.json(), OrderController.create_order);

    app.get('/products', ProductsController.products_get_all);
    app.get('/product/:productId', ProductsController.get_product_by_id);

    app.get('/menus', MenuController.menus_get_all);
    app.get('/menu/:menuId', MenuController.get_menu_by_id);

    app.get('/promotions', bodyParser.json(), PromotionController.getAll);
    app.get('/promotion/:promotionId', PromotionController.getPromotionById);

};
