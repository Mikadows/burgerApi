const bodyParser = require('body-parser');
const Controllers = require('../controllers');
const ProductsController = Controllers.ProductController;
const MenuController = Controllers.MenuController;
const PromotionController = Controllers.PromotionController;
const OrderController = Controllers.OrderController;
const AuthMiddleware = require('../middlewares/auth.middleware');

module.exports = function(app) {


    /**
     * Apply is admin middleware to all routes below
     */
    app.use(AuthMiddleware.isAdmin);

    /**
     * Product management
     */

    app.post('/manage/create/product', bodyParser.json(), ProductsController.create_product);

    app.put('/manage/product/:productId', bodyParser.json() , ProductsController.modif_product);

    app.delete('/manage/product/:productId', ProductsController.delete_product);

    /**
     * Menu management
     */

    app.post('/manage/create/menu', bodyParser.json(), MenuController.create_menu);

    app.put('/manage/menu/:menuId', bodyParser.json() , MenuController.modif_menu);

    app.delete('/manage/menu/:menuId', MenuController.delete_menu);

    app.put('/manage/menu/products/:menuId', bodyParser.json() , MenuController.add_product);

    app.delete('/manage/menu/products/:menuId', bodyParser.json(), MenuController.delete_menu_product);

    /**
     * Order management
     */

    app.get('/manage/orders', OrderController.orders_get_all);

    /**
     * Promotions management
     */

    app.post('/manage/promotion', bodyParser.json(), PromotionController.addPromotion);

    app.put('/manage/promotion/:promotionId', bodyParser.json(),  PromotionController.modifyPromotion);

    app.delete('/manage/promotion/:promotionId', PromotionController.deletePromotion);
};
