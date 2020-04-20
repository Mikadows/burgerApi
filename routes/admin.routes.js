const bodyParser = require('body-parser');
const Controllers = require('../controllers');
const ProductsController = Controllers.ProductController;
const MenuController = Controllers.MenuController;
const PromotionController = Controllers.PromotionController;

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
    app.put('/manage/menu/addproduct/:menuId', bodyParser.json() , MenuController.add_product);
    //TODO : MiddleWare check si user is admin
    app.delete('/manage/menu/:menuId/:productId', MenuController.delete_menu_product);

    /**
     * Promotions management
     */

    app.post('/manage/promotion', bodyParser.json(), (req, res) => {

            //try{
            Promise.resolve().then( () => {
                if( req.body.menus && req.body.products && req.body.percentReduction ) {
                    return PromotionController.addPromotion(req.body.menus,
                                                            req.body.products,
                                                            req.body.percentReduction);
                    //res.status(201).json(ret);
                } else {
                    throw new Error('Bad request');
                }
            }).then( (ret ) => {
                if(ret){
                    res.status(201).json(ret);
                }
            }).catch( (err) => {
                    if(err) res.status(500).end();
            } );




                //const ret = await PromotionController.addPromotion(req.body.menus, req.body.products, req.body.percentReduction);

/*
                if(ret) {

                } else {
                    res.status(409).end();
                }*/
/*            }catch (e) {
                res.status(500).end();
            }*/

        //res.status(400).end();
    });

    app.put('manage/promotion', bodyParser.json(), async (req, res) => {
        if( req.body._id && req.body.menus && req.body.products && req.body.percentReduction ) {
            //TODO: Modify controller
        }
    });

    app.delete('manage/promotion', bodyParser.json(), async (req, res) => {
        if(req.body._id){

        }
        res.status(400).end();

    });
};
