let ProductModel = require('../models').Product;
let ProductDao = require('../dao').ProductDAO;
let mongoose = require('mongoose');
let CoreController = require('./core.controller');

class ProductController extends CoreController {

     static async create_product(req, res, next){
         let data = req.body;
         const authorizedFields = ['name','price'];
         console.log(req.body);
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

    static async modif_product(req, res, next){
        const id = req.params.productId;
        let data = req.body;
        Promise.resolve()
            .then(() =>  ProductController.productNotExist(req,res,next,id))
            .then(product => {
                // Check of product alreadyExist to be sure we avoid duplicate Name
                ProductController.productNameAlreadyExist(req,res,next,id);
                product.set(data);
                return product.save();
            })
            .then(product => ProductController.render(product))
            .then(product => res.json({
                product,
                request: {
                    type: 'GET',
                    url: `http://localhost:3000/manage/product/${id}`
                }
            }))
            .catch(next);
    }

    static async productNotExist(req,res,next,id){
        return Promise.resolve()
            .then(() => ProductDao.findById(id))
            .catch(err =>{
                res.status(404).json({
                    message: "This product doesn't exist"
                }).end();
                throw new Error("This product doesn't exist");
            });
    }

    static async productNameAlreadyExist(req,res,next,id) {
        Promise.resolve().then(() => ProductDao
            .find( {$and:[{"_id":{$ne:id}},{"name": {$eq:req.body.name}}]}
                ))
                .then(product => {
                    if (Array.isArray(product) && product.length) {
                        res.status(409).json({
                            message: "This product already exist"
                        }).end();
                        throw new Error("This product already exist");
                    }
            }).catch(next)
    }
}

ProductController.prototype.modelName = 'Product';
module.exports = ProductController;



