const bodyParser = require('body-parser');

const Controllers = require('../controllers');
const ProductsController = Controllers.ProductController;
const MenuController = Controllers.MenuController;
const PromotionController = Controllers.PromotionController;
const middleware = require('../middlewares');
const AuthMiddleware = middleware.AuthMiddleware;

module.exports = function(app) {

    /**
     * Product management
     */
    app.post('/manage/create/product',  AuthMiddleware.isAdmin(), bodyParser.json(), ProductsController.create_product);

    app.put('/manage/product/:productId', AuthMiddleware.isAdmin(), bodyParser.json() , ProductsController.modif_product);

    app.delete('/manage/product/:productId', AuthMiddleware.isAdmin(), ProductsController.delete_product);

    /**
     * Menu management
     */
    app.post('/manage/create/menu',  AuthMiddleware.isAdmin(), bodyParser.json(), MenuController.create_menu);
  
    app.put('/manage/menu/:menuId',  AuthMiddleware.isAdmin(), bodyParser.json() , MenuController.modif_menu);
  
    app.delete('/manage/menu/:menuId',  AuthMiddleware.isAdmin(), MenuController.delete_menu);
  
    app.put('/manage/menu/product/:menuId',  AuthMiddleware.isAdmin(), bodyParser.json() , MenuController.add_product);

    app.delete('/manage/menu/product/:menuId',  AuthMiddleware.isAdmin(), bodyParser.json() ,MenuController.delete_menu_product);

    /**
     * Promotions management
     */
    app.post('/manage/promotion', AuthMiddleware.isAdmin(), bodyParser.json(), PromotionController.addPromotion2);

    app.put('/manage/promotion/:promotionId', AuthMiddleware.isAdmin(), bodyParser.json(),  PromotionController.modifyPromotion);

    app.delete('/manage/promotion/:promotionId', AuthMiddleware.isAdmin(), PromotionController.deletePromotion);
};
