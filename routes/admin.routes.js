const bodyParser = require('body-parser');
const ProductsController = require('../controllers').ProductController;

module.exports = function(app) {

    /**
     * Product management
     */
    //TODO : MiddleWare check si user is admin
    app.get('/manage/products', ProductsController.products_get_all);

    //TODO : MiddleWare check si user is admin
    app.post('/manage/create/product', bodyParser.json(), ProductsController.create_product);

    app.get('/manage/product/:productId', ProductsController.get_product_by_id);
    //TODO : MiddleWare check si user is admin
    app.put('/manage/product/:productId', bodyParser.json() , ProductsController.modif_product);
    //TODO : MiddleWare check si user is admin
    app.delete('/manage/product/:id', async (req, res) => {
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
