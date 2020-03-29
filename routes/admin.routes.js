const bodyParser = require('body-parser');
const ProductModel = require('../models').Product;
const MenuModel = require('../models').Menu;
const PromotionModel = require('../models').Promotion;


module.exports = function(app) {

    /**
     * Product management
     */

    app.post('/manage/product', bodyParser.json() , async (req, res) => {
        //TODO : Create product
        if(req.body.name && req.body.price !== undefined){
            let product = new ProductModel({
                name: req.body.name,
                price: req.body.price,
            });
            product.save();
            res.status(200).send("Parfait");
        }

        res.status(501).end("missing argument in product");
    });

    app.put('/manage/product/:id', async (req, res) => {
        //TODO : Update product
        res.status(501).end();
    });

    app.delete('/manage/product/:id', async (req, res) => {
        //TODO : Delete product
        res.status(501).end();
    });

    /**
     * Menu management
     */

    app.post('/manage/menu', async (req, res) => {
        //TODO : Create product
        res.status(501).end();
    });

    app.put('/manage/menu/:id', async (req, res) => {
        //TODO : Update product
        res.status(501).end();
    });

    app.delete('/manage/menu/:id', async (req, res) => {
        //TODO : Delete product
        res.status(501).end();
    });

};
