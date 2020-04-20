const PromotionDAO = require('../dao').PromotionDAO;

class PromotionController {

    static addPromotion(menus, products, percentReduction){
        if ((!this.isEmpty(menus) || !this.isEmpty(products)) && percentReduction){
            const promotion = {"menu":menus, "products":products, "percentReduction":percentReduction}
            PromotionDAO.savePromotion(promotion);
            return promotion;
        } else {
            return -1; //Bad request
        }
        return 0;
    }

    static modifyPromotion(){

    }

    static deletePromotion(){

    }

    /**
     * Get all promotions
     */
    static getAll(){
        const promotions = PromotionDAO.getAllPromotions();

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
