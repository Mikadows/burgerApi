let ProductModel = require('../models').Product;
let ProductDao = require('../dao').ProductDAO;
let mongoose = require('mongoose');
let CoreController = require('./core.controller');

class ProductController extends CoreController {

     static async create_product(req, res, next){
         let data = req.body;
         const authorizedFields = ['name','price'];
         Promise.resolve().then(() => {
            //TODO : verif que le produit avec le meme nom n existe pas deja chez un meme commercant
            return ProductDao.findOne({name:req.body.name});
         })
             .then(product => {
             if(product){
                 res.status(409).json({
                     message:"This product already exist"
                 }).end();
                 throw new Error("This product already exist");
             }
             return ProductController.create(data, {authorizedFields});
         })
             .then(product => ProductController.render(product))
             .then(product => res.json(product))
             .catch(next);
     };

    static async products_get_all(req, res, next) {
        ProductModel
            .find()
            .select("name price _id")
            .exec()
            .then(docs => {
                const response = {
                    count: docs.length,
                    products: docs.map(doc => {
                        return {
                            name: doc.name,
                            price: doc.price,
                            _id: doc._id,
                            request: {
                                type: 'GET',
                                url: `http://localhost:3000/manage/product/${doc._id}`
                            }
                        };
                    })
                };
                res.status(200).json(response);

            }).catch(err =>{
            res.status(400).json({
                message: "Bad request",
                err,
            });
        });
    };

    static async get_product_by_id(req,res,next) {
        const id = req.params.productId;
        // TODO : link this with DAO request
        ProductModel
            .findById(id)
            .select('name price _id')
            .exec()
            .then(doc => {
                if(doc){
                    res.status(200).json({
                        product: doc,
                        request: {
                            type: 'GET',
                            url: `http://localhost3000/manage/products`,
                        }
                    });
                }
            }).catch(err => {
            res.status(400).json({
                message: "Bad request",
                err,
            });
        });
    };
}

ProductController.prototype.modelName = 'Product';
module.exports = ProductController;



