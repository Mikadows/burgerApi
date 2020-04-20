const PromotionDAO = require('../dao').PromotionDAO;

class PromotionController {

    static addPromotion(menus, products, percentReduction){
        if ((!this.isEmpty(menus) || !this.isEmpty(products)) && percentReduction){
            let promotion = {"menu":menus, "products":products, "percentReduction":percentReduction}
            promotion = PromotionDAO.savePromotion(promotion);
            return promotion;
        } else {
            throw new Error("Bad Request");
            //return -1; //Bad request
        }
    }

    static modifyPromotion(id, menus, products, percentReduction){

    }

    static deletePromotion(id){

    }

    /**
     * Get all promotions
     */
    static getAll(){
        const promotions = PromotionDAO.getAllPromotions();

        console.log(JSON.stringify(promotions))
        return promotions;
    }

    /**
     * Get promotion by ID
     * @param id
     */
    static getById(id){

    }

    static isEmpty(obj){
        return Object.keys(obj).length === 0;
    }

}

module.exports = PromotionController;
