let OrderModel = require('../models').Order;
let ProductModel = require('../models').Product;
let MenuModel = require('../models').Menu;
let CoreController = require('./core.controller');
let ProductController = require('./product.controller');
let MenuController = require('./menu.controller');
let OrderDao = require('../dao').OrderDAO;
let PromotionDao = require('../dao').PromotionDAO;
let mongoose = require('mongoose');



class OrderController extends CoreController {

    static render(list,options = {}){
        const populates = [
            {path:'products'},
            {path:'menus'}
        ];
        return super.render(list, { ...options,populates});
    }

    static async create_order(req, res, next) {
        let data = req.body;
        const authorizedFields = ['products','menus', 'totalPrice'];
        Promise.resolve()
            .then(() => {
                const promiseAll = [];
                if(!Array.isArray(data.products) && !Array.isArray(data.menus) && !data.products.length && !data.menus.length){
                    res.status(406).json({
                        status: 406,
                        message:"You need to add one product with _id field in your products Array OR you need to add one menu with _id field in your menus Array"
                    }).end();
                    throw new Error("You need to add one product with _id field in your products Array OR you need to add one menu with _id field in your menus Array");
                }

                data.products.forEach((elem, i)=>{
                    promiseAll.push(OrderController.checkQuantity(req,res,next,'Product',elem));
                    promiseAll.push(ProductController.productNotExist(req,res,next,elem._id));
                });

                data.menus.forEach((elem, i)=>{
                    promiseAll.push(OrderController.checkQuantity(req,res,next,'Menu',elem));
                    promiseAll.push(MenuController.menuNotExist(req,res,next,elem._id));
                });

                return Promise.all(promiseAll);
            }).then(async () =>{
                data.totalPrice = await OrderController.getPriceObjectByQuantity(data);
            })
            .then( () => OrderController.create(data, {authorizedFields}))
            .then( order => OrderController.render(order))
            .then( order => res.json(order))
            .catch(next);
    };

    static async orders_get_all(req, res, next) {
        OrderModel
            .find()
            .populate({
            path: 'menus',
            model: 'Menu',
            populate: {
                path: 'products',
                model: 'Product'
                }
            })
            .populate('products')
            .select("totalPrice products menus _id")
            .exec()
            .then(docs => {
                const response = {
                    count: docs.length,
                    orders: docs.map(doc => {
                        return {
                            totalPrice: doc.totalPrice,
                            products: doc.products,
                            menus: doc.menus,
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

    static async get_order_by_user_id(req,res,next) {
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
            })
    }


    static async getPriceObjectByQuantity(data){
            let totalPrice = 0;

            await Promise.all(data.products.map(async (elem, i) => {
                await ProductModel.find({_id: elem._id}).then(async (doc) => {
                    let _id = mongoose.Types.ObjectId(elem._id);
                    let promotions = await PromotionDao.find({"products":{_id}});
                    let basePrice = doc[0].price;
                    promotions.map(elem => {
                        let startDateInt = Date.parse(elem.startDate);
                        let endDateInt = Date.parse(elem.endDate);
                        if(Date.now() > startDateInt && Date.now() < endDateInt) basePrice = basePrice - (basePrice * elem.percentReduction/100);
                    });

                    totalPrice += basePrice * elem.quantity;
                });
            }));

            await Promise.all(data.menus.map(async (elem, i) => {
                await MenuModel.find({_id: elem._id}).then(async doc => {
                    let _id = mongoose.Types.ObjectId(elem._id);
                    let promotions = await PromotionDao.find({"menus":{_id}});
                    let basePrice = doc[0].price;
                    promotions.map(elem => {
                        let startDateInt = Date.parse(elem.startDate);
                        let endDateInt = Date.parse(elem.endDate);
                        if(Date.now() > startDateInt && Date.now() < endDateInt)
                            basePrice = basePrice - (basePrice * elem.percentReduction/100);
                    });
                    totalPrice += basePrice * elem.quantity;
                });
            }));

            return totalPrice;
    }



    static async checkQuantity(req,res,next,entityName,entity){
        return Promise.resolve().then(() => {
            if (typeof entity.quantity === 'undefined') {
                res.status(409).json({
                    message: `One or more ${entityName} doesn't contain quantity field in it`
                }).end();
                throw new Error(`One or more ${entityName} doesn't contain quantity field in it`);
            }
            // check quantity below 0 or equal 0
            if (entity.quantity <= 0) {
                res.status(409).json({
                    message: `One or more ${entityName} have a quantity equals or below 0`
                }).end();
                throw new Error(`One or more ${entityName} have a quantity equals or below 0`);
            }
        })
    }
}

OrderController.prototype.modelName = 'Order';
module.exports = OrderController;






