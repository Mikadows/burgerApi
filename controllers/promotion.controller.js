const PromotionDAO = require('../dao').PromotionDAO;
const CoreController = require('./core.controller');
const PromotionModel = require('../models').Promotion;
const mongoose = require('mongoose');

class PromotionController extends CoreController {
    /**
     * Add promotion
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static addPromotion(req, res, next){
        const data = req.body;
        const authorizedFields = ['name', 'menus','products', 'percentReduction', 'startDate', 'endDate'];
        Promise.resolve().then(() => {

            if(req.body.name && req.body.menus && req.body.products && req.body.percentReduction && req.body.startDate && req.body.endDate ){
                return PromotionDAO.findOne({name:req.body.name, menus:req.body.menus, products:req.body.products,
                    percentReduction:req.body.percentReduction,
                    startDate: Date.parse(req.body.startDate), endDate: Date.parse(req.body.endDate)});
            } else {
                res.status(400).end();
            }
        })
            .then(promotion => {
                if(promotion){
                    res.status(409).json({
                        message:"This promotion already exist"
                    }).end();
                    throw new Error("This promotion already exist");
                }
                return PromotionController.create(data, {authorizedFields});
            })
            .then(promotion => PromotionController.render(promotion))
            .then(promotion => res.json(promotion))
            .catch(next);
    }

    /**
     * Delete promotion by id
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static async deletePromotion(req,res,next){
        const id = req.params.promotionId;
        Promise.resolve()
            .then(() =>  PromotionController.promotionNotExist(req,res,next,id))
            .then(() => {
                // Check of product alreadyExist to be sure we avoid duplicate Name
                if(PromotionDAO.deleteById(id)){
                    res.status(200).json({
                        message: `The promotion ${id} has been delete with success`
                    }).end();
                }
            })
            .catch(next);
    }

    /**
     * Modify promotion by id
     * @param req
     * @param res
     * @param next
     */
    static modifyPromotion(req, res, next){
        const id = req.params.promotionId;
        const data = req.body;
        Promise.resolve()
            .then(() =>  PromotionController.promotionNotExist(req,res,next,id))
            .then(promotion => {
                // Check of product alreadyExist to be sure we avoid duplicate Name
                PromotionController.promotionNameNotSameIdAlreadyExist(req,res,next,id);
                promotion.set(data);
                return promotion.save();
            })
            .then(product => PromotionController.render(product))
            .then(product => res.json({
                product,
                request: {
                    type: 'GET',
                    url: `${process.env.SERV_ADDRESS}/promotion/${id}`
                }
            }))
            .catch(next);
    }

    /**
     * Get All promotions
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static async getAll(req, res, next) {
        PromotionModel
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
            .select("_id name menus products percentReduction startDate endDate")
            .exec()
            .then(docs => {
                const response = {
                    count: docs.length,
                    promotions: docs.map(doc => {
                        return {
                            _id: doc._id,
                            name: doc.name,
                            menus: doc.menus,
                            products: doc.products,
                            percentReduction: doc.percentReduction,
                            request: {
                                type: 'GET',
                                url: `${process.env.SERV_ADDRESS}/promotion/${doc._id}`
                            }
                        };
                    })
                };
                if(response.count === 0){
                    res.status(204).end();
                } else {
                    res.status(200).json(response);
                }

            }).catch(err =>{
            res.status(400).json({
                message: "Bad request",
                err,
            });
        });
    }

    /**
     * Get promotion by id
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static async getPromotionById(req,res,next) {
        const id = req.params.promotionId;
        await PromotionController.promotionNotExist(req, res, next, id);

        PromotionModel
            .findById(id)
            .populate({
                path: 'menus',
                model: 'Menu',
                populate: {
                    path: 'products',
                    model: 'Product'
                }
            })
            .populate('products')
            .select("_id name menus products percentReduction startDate endDate")
            .then(doc => {
                if(doc){
                    res.status(200).json({
                        promotion: doc
                    });
                }
            }).catch(err => {
            res.status(400).json({
                message: "Bad request",
                err,
            });
        });
    }

    /**
     * Checkt if product is empty
     * @param obj
     * @returns {boolean}
     */
    static isEmpty(obj){
        return Object.keys(obj).length === 0;
    }

    /**
     * Check if product exist
     * @param req
     * @param res
     * @param next
     * @param id
     * @returns {Promise<Promotion>}
     */
    static async promotionNotExist(req, res, next, id){
        return Promise.resolve().then(() => PromotionDAO.findById(id))
            .then(product =>{
                if(!product){
                    res.status(409).json({
                        message: `The promotion ${id} doesn't exist`
                    }).end();
                    throw new Error(`The promotion ${id} doesn't exist`);
                }
                return product;
            });
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     * @param id
     * @returns {Promise<void>}
     */
    static async promotionNameNotSameIdAlreadyExist(req,res,next,id) {
        Promise.resolve().then(() => PromotionDAO
            .find( {$and:[{"_id":{$ne:id}},{"name": {$eq:req.body.name}}]}
            ))
            .then(promotion => {
                if (Array.isArray(promotion) && promotion.length) {
                    res.status(409).json({
                        message: "This promotion already exist"
                    }).end();
                    throw new Error("This promotion already exist");
                }
            }).catch(next)
    }


}

PromotionController.prototype.modelName = 'Promotion';
module.exports = PromotionController;
