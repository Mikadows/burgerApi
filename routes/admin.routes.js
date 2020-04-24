const bodyParser = require('body-parser');
const ProductsController = require('../controllers').ProductController;
const MenuController = require('../controllers').MenuController;

module.exports = function(app) {

    /**
     * Product management
     */

    //TODO : MiddleWare check si user is admin
    app.post('/manage/create/product', bodyParser.json(), ProductsController.create_product);


    //TODO : MiddleWare check si user is admin
    app.put('/manage/product/:productId', bodyParser.json() , ProductsController.modif_product);
    //TODO : MiddleWare check si user is admin
    app.delete('/manage/product/:productId', ProductsController.delete_product);

    /**
     * Menu management
     */

    //TODO : MiddleWare check si user is admin
    app.post('/manage/create/menu', bodyParser.json(), MenuController.create_menu);
    //TODO : MiddleWare check si user is admin
    app.put('/manage/menu/:menuId', bodyParser.json() , MenuController.modif_menu);
    //TODO : MiddleWare check si user is admin
    app.delete('/manage/menu/:menuId', MenuController.delete_menu);
    //TODO : MiddleWare check si user is admin
    app.put('/manage/menu/product/:menuId', bodyParser.json() , MenuController.add_product);
    //TODO : MiddleWare check si user is admin
    app.delete('/manage/menu/product/:menuId', bodyParser.json() ,MenuController.delete_menu_product);

};
