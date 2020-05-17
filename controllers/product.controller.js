let ProductModel = require('../models').Product;
let ProductDao = require('../dao').ProductDAO;
let CoreController = require('./core.controller');

class ProductController extends CoreController {

    /**
     * Render and populate the model
     * @param list
     * @param options
     * @returns {Promise<*>}
     */
    static render(list,options = {}){
        const populates = [
            {path:'products'}
        ];
        return super.render(list, { ...options,populates});
    }

    /**
     * Create a noun existing product
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
     static async create_product(req, res, next){
         let data = req.body;
         const authorizedFields = ['name','price'];
         Promise.resolve().then(() => {
            return ProductDao.findOne({name:req.body.name});
         })
             .then(product => {
                 if(product){
                     res.status(409).json({
                         message:"This product already exist"
                     }).end();
                     throw new Error("This product already exist");
                 }
                 authorizedFields.map(value =>{
                     if(typeof data[value] == 'undefined') {
                         res.status(409).json({
                             message:`The value here: [${authorizedFields}] have to be put in your body`
                         }).end();
                         throw new Error(`The value here: [${authorizedFields}] have to be put in your body`);
                     }
                 })

             })
             .then(() => ProductController.create(data, {authorizedFields}))
             .then(product => ProductController.render(product))
             .then(product => res.status(201).json(product))
             .catch(next);
     };

    /**
     * Get all the products in database
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
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
                                url: `${process.env.SERV_ADDRESS}/product/${doc._id}`
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

    /**
     * Get the product by its id
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static async get_product_by_id(req,res,next) {
        const id = req.params.productId;
        ProductController.productNotExist(req,res,next,id);
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
                            url: `${process.env.SERV_ADDRESS}/products`,
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

    /**
     * Modify the product by its id
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static async modif_product(req, res, next){
        const id = req.params.productId;
        let data = req.body;
        Promise.resolve()
            .then(() =>  ProductController.productNotExist(req,res,next,id))
            .then(product => {
                // Check of product alreadyExist to be sure we avoid duplicate Name
                ProductController.productNameNotSameIdAlreadyExist(req,res,next,id);
                product.set(data);
                return product.save();
            })
            .then(product => ProductController.render(product))
            .then(product => res.status(200).json({
                product,
                request: {
                    type: 'GET',
                    url: `${process.env.SERV_ADDRESS}/product/${id}`
                }
            }))
            .catch(next);
    }

    /**
     * Delete the product by its id if exist
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static async delete_product(req,res,next){
        const id = req.params.productId;
        Promise.resolve()
            .then(() =>  ProductController.productNotExist(req,res,next,id))
            .then(() => {
                // Check of product alreadyExist to be sure we avoid duplicate Name
                if(ProductDao.deleteById(id)){
                    res.status(200).json({
                        message: `The product ${id} has been delete with success`
                    }).end();
                }
            })
            .catch(next);
    }

    /**
     * Check if the product exist or not
     * @param req
     * @param res
     * @param next
     * @param id
     * @returns {Promise<Product>}
     */
    static async productNotExist(req,res,next,id){
        return Promise.resolve().then(() => ProductDao.findById(id))
            .then(product =>{
                if(!product){
                    res.status(404).json({
                        message: `The product ${id} doesn't exist`
                    });
                    throw new Error(`The product ${id} doesn't exist`);
                }
                return product;
            });
    }

    /**
     * Check if a product already exist with this name
     * @param req
     * @param res
     * @param next
     * @param id
     * @returns {Promise<void>}
     */
    static async productNameNotSameIdAlreadyExist(req,res,next,id) {
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



