const PromotionDAO = require('../dao').PromotionDAO;
const CoreController = require('./core.controller');
const PromotionModel = require('../models').Promotion;

class PromotionController extends CoreController {

    // static addPromotion(menus, products, percentReduction){
    //     if ((!this.isEmpty(menus) || !this.isEmpty(products)) && percentReduction){
    //         let promotion = {"menu":menus, "products":products, "percentReduction":percentReduction}
    //         promotion = PromotionDAO.savePromotion(promotion);
    //         return promotion;
    //     } else {
    //         throw new Error("Bad Request");
    //         //return -1; //Bad request
    //     }
    // }

    /**
     * Add promotion
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static async addPromotion2(req, res, next){
        const data = req.body;
        const authorizedFields = ['name', 'menus','products', 'percentReduction'];
        Promise.resolve().then(() => {

            if(req.body.name && req.body.menus && req.body.products && req.body.percentReduction ){
                return PromotionDAO.findOne({name:req.body.name, menus:req.body.menus, products:req.body.products, percentReduction:req.body.percentReduction});
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
                    url: `http://localhost:3000/promotion/${id}`
                }
            }))
            .catch(next);
    }

    /**
     * Get all promotions
     */
    // static getAll(){
    //     const promotions = PromotionDAO.getAllPromotions();
    //
    //     console.log(JSON.stringify(promotions))
    //     return promotions;
    // }

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
            .select("_id name menus products percentReduction")
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
                                url: `http://localhost:3000/promotion/${doc._id}`
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
            .select("_id name menus products percentReduction")
            .exec()
            .then(doc => {
                if(doc){
                    res.status(200).json({
                        product: doc
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
                        message: `The product ${id} doesn't exist`
                    }).end();
                    throw new Error(`The product ${id} doesn't exist`);
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
                        message: "This promtion already exist"
                    }).end();
                    throw new Error("This promtion already exist");
                }
            }).catch(next)
    }

}

PromotionController.prototype.modelName = 'Promotion';
module.exports = PromotionController;
