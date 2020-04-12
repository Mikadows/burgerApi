let MenuModel = require('../models').Menu;
let MenuDao = require('../dao').MenuDAO;
let CoreController = require('./core.controller');
let ProductController = require('./product.controller');
let ProductDao = require('../dao').ProductDAO;

class MenuController extends CoreController {

    static async create_menu(req, res, next) {
        let data = req.body;
        const authorizedFields = ['name','price','products'];
        Promise.resolve().then(() => {
            //TODO : verif que le produit avec le meme nom n existe pas deja chez un meme commercant
            return MenuDao.findOne({name:req.body.name});
        })
            .then(menu => {
                if(menu){
                    res.status(409).json({
                        status: 409,
                        message:"This menu already exist"
                    }).end();
                    throw new Error("This menu already exist");
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
                    message:"This menu need 2 id of products valid to be create"
                }).end();
                throw new Error("This menu need 2 products to be create");
            }


            
                for(let i = 0; i < data.products.length; i++){
                    let test = ProductController.productNotExist(req,res,next,data.products[i]._id);
                }





                return MenuController.create(data, {authorizedFields});
            })
            .then(menu => MenuController.render(menu))
            .then(menu => res.json(menu))
            .catch(next);
    };

    static async menus_get_all(req, res, next) {
        MenuModel
            .find()
            .select("name price _id")
            .exec()
            .then(docs => {
                const response = {
                    count: docs.length,
                    menus: docs.map(doc => {
                        return {
                            name: doc.name,
                            price: doc.price,
                            _id: doc._id,
                            request: {
                                type: 'GET',
                                url: `http://localhost:3000/manage/menu/${doc._id}`
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

    static async get_menu_by_id(req,res,next) {
        const id = req.params.menuId;
        MenuController.menuNotExist(req,res,next,id);
        MenuModel
            .findById(id)
            .select('name price _id')
            .exec()
            .then(doc => {

                if(doc){
                    res.status(200).json({
                        menu: doc,
                        request: {
                            type: 'GET',
                            url: `http://localhost3000/manage/menus`,
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

    static async modif_menu(req, res, next){
        const id = req.params.menuId;
        let data = req.body;
        Promise.resolve()
            .then(() =>  MenuController.menuNotExist(req,res,next,id))
            .then(menu => {
                // Check of menu alreadyExist to be sure we avoid duplicate Name
                MenuController.menuNameNotSameIdAlreadyExist(req,res,next,id);
                menu.set(data);
                return menu.save();
            })
            .then(menu => MenuController.render(menu))
            .then(menu => res.json({
                menu,
                request: {
                    type: 'GET',
                    url: `http://localhost:3000/manage/menu/${id}`
                }
            }))
            .catch(next);
    }

    static async delete_menu(req,res,next){
        const id = req.params.menuId;
        Promise.resolve()
            .then(() =>  MenuController.menuNotExist(req,res,next,id))
            .then(() => {
                // Check of menu alreadyExist to be sure we avoid duplicate Name
                if(MenuDao.deleteById(id)){
                    res.status(200).json({
                        message: `The menu ${id} has been delete with success`
                    }).end();
                }
            })
            .catch(next);
    }

    static async menuNotExist(req,res,next,id){
        return Promise.resolve()
            .then(() => MenuDao.findById(id))
            .then(menu =>{
                if(!menu){
                    res.status(404).json({
                        message: "This menu doesn't exist"
                    }).end();
                    throw new Error("This menu doesn't exist");
                }
                return menu;
            }).catch(next);
    }

    static async menuNameNotSameIdAlreadyExist(req,res,next,id) {
        Promise.resolve().then(() => MenuDao
            .find( {$and:[{"_id":{$ne:id}},{"name": {$eq:req.body.name}}]}
            ))
            .then(menu => {
                if (Array.isArray(menu) && menu.length) {
                    res.status(409).json({
                        message: "This menu already exist"
                    }).end();
                    throw new Error("This menu already exist");
                }
            }).catch(next)
    }
}

MenuController.prototype.modelName = 'Menu';
module.exports = MenuController;



