let OrderModel = require('../models').Order;
let OrderDao = require('../dao').OrderDAO;
let CoreController = require('./core.controller');
let ProductController = require('./product.controller');

class OrderController extends CoreController {

    static async create_order(req, res, next) {
        let data = req.body;
        const authorizedFields = ['name','price','products'];
        Promise.resolve().then(() => {
            //TODO : verif que le produit avec le meme nom n existe pas deja chez un meme commercant
            return OrderDao.findOne({name:req.body.name});
        })
            .then(order => {
                if(order){
                    res.status(409).json({
                        status: 409,
                        message:"This order already exist"
                    }).end();
                    throw new Error("This order already exist");
                }

                if(!Array.isArray(data.products)){
                    res.status(406).json({
                        status: 406,
                        message:"You need to add products Array in your body"
                    }).end();
                    throw new Error("You need to add products Array in your body");
                }

                if(data.products.length < 2){
                    res.status(406).json({
                        status: 406,
                        message:"This order need 2 id of products valid to be create"
                    }).end();
                    throw new Error("This order need 2 products to be create");
                }


                const promiseAll = [];

                data.products.forEach((elem, i)=>{
                    promiseAll.push(ProductController.productNotExist(req,res,next,elem._id));
                });

                return Promise.all(promiseAll);
            })
            .then(() => OrderController.create(data, {authorizedFields}))
            .then(order => OrderController.render(order))
            .then(order => res.json(order))
            .catch(next);
    };

    static async orders_get_all(req, res, next) {
        OrderModel
            .find()
            .select("name price products _id")
            .exec()
            .then(docs => {
                const response = {
                    count: docs.length,
                    orders: docs.map(doc => {
                        return {
                            name: doc.name,
                            price: doc.price,
                            products: doc.products,
                            _id: doc._id,
                            request: {
                                type: 'GET',
                                url: `http://localhost:3000/order/${doc._id}`
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

    static async get_order_by_id(req,res,next) {
        const id = req.params.orderId;
        OrderController.orderNotExist(req,res,next,id);
        OrderModel
            .findById(id)
            .select('name price products _id')
            .exec()
            .then(doc => {
                if(doc){
                    res.status(200).json({
                        order: doc,
                        request: {
                            type: 'GET',
                            url: `http://localhost:3000/orders`,
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

    static async modif_order(req, res, next){
        const id = req.params.orderId;
        let data = req.body;
        Promise.resolve()
            .then(() =>  OrderController.orderNotExist(req,res,next,id))
            .then(order => {
                // Check of order alreadyExist to be sure we avoid duplicate Name
                OrderController.orderNameNotSameIdAlreadyExist(req,res,next,id);
                order.set(data);
                return order.save();
            })
            .then(order => OrderController.render(order))
            .then(order => res.json({
                order,
                request: {
                    type: 'GET',
                    url: `http://localhost:3000/order/${id}`
                }
            }))
            .catch(next);
    }

    static async delete_order(req,res,next){
        const id = req.params.orderId;
        Promise.resolve()
            .then(() =>  OrderController.orderNotExist(req,res,next,id))
            .then(() => {
                // Check of order alreadyExist to be sure we avoid duplicate Name
                if(OrderDao.deleteById(id)){
                    res.status(200).json({
                        message: `The order ${id} has been delete with success`
                    }).end();
                }
            })
            .catch(next);
    }

    static async orderNotExist(req,res,next,id){
        return Promise.resolve()
            .then(() => OrderDao.findById(id))
            .then(order =>{
                if(!order){
                    res.status(404).json({
                        message: "This order doesn't exist"
                    }).end();
                    throw new Error("This order doesn't exist");
                }
                return order;
            }).catch(next);
    }

    static async orderNameNotSameIdAlreadyExist(req,res,next,id) {
        Promise.resolve().then(() => OrderDao
            .find( {$and:[{"_id":{$ne:id}},{"name": {$eq:req.body.name}}]}
            ))
            .then(order => {
                if (Array.isArray(order) && order.length) {
                    res.status(409).json({
                        message: "This order already exist"
                    }).end();
                    throw new Error("This order already exist");
                }
            }).catch(next)
    }
}

OrderController.prototype.modelName = 'Order';
module.exports = OrderController;






