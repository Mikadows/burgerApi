const bodyParser = require('body-parser');
const ProductsController = require('../controllers').ProductController;
const middleware = require('../middlewares');
const AuthMiddleware = middleware.AuthMiddleware;

module.exports = function(app) {

    /**
     * Product management
     */
    //TODO : MiddleWare check si user is admin
    app.get('/manage/products', AuthMiddleware.isAdmin(), ProductsController.products_get_all);

    //TODO : MiddleWare check si user is admin
    app.post('/manage/create/product', bodyParser.json(), AuthMiddleware.isAdmin(), ProductsController.create_product);

    app.get('/manage/product/:productId', AuthMiddleware.isAdmin(), ProductsController.get_product_by_id);
    //TODO : MiddleWare check si user is admin
    //app.put('/manage/product/:productId', ProductsController.modif_product);
    //TODO : MiddleWare check si user is admin
    app.delete('/manage/product/:id', AuthMiddleware.isAdmin(), async (req, res) => {
        //TODO : Delete product
        res.status(501).end();
    });

    /**
     * Menu management
     */

    app.post('/manage/menu', async (req, res) => {
        //TODO : Create menu
        res.status(501).end();
    });

    app.put('/manage/menu/:id', async (req, res) => {
        //TODO : Update menu
        res.status(501).end();
    });

    app.delete('/manage/menu/:id', async (req, res) => {
        //TODO : Delete menu
        res.status(501).end();
    });

};
