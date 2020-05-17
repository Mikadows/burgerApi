let MenuModel = require('../models').Menu;
let MenuDao = require('../dao').MenuDAO;
let CoreController = require('./core.controller');
let ProductController = require('./product.controller');
let mongoose = require('mongoose');

class MenuController extends CoreController {
    /**
     * Render populates models
     * @param list
     * @param options
     * @returns {Promise<*>}
     */
    static render(list,options = {}){
        const populates = [
            {
                path:'products',
                select: 'name price'
            }
        ];
        return super.render(list, { ...options,populates});
    }

    /**
     * Render Menu from id
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static async get_menu_by_id(req, res, next){
        const id = req.params.menuId;
        await MenuController.menuNotExist(req,res,next,id);
        const fields = [
            '_id',
            'name',
            'price',
            'products'
        ];

        Promise.resolve()
            .then(() => MenuDao.findById(id))
            .then(menu => MenuController.read(menu, { fields }))
            .then(menu => {
                return res.json({
                    menu,
                    request: {
                        type: 'GET',
                        url: `${process.env.SERV_ADDRESS}/menu/${menu._id}`
                    }
                })}
            ).catch(err => {
                    res.status(500).json({
                        message: "Internal Server Error",
                        err,
                    })
            });
    }

    /**
     * Create Menu that hasn't the same name
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static async create_menu(req, res, next) {
        let data = req.body;
        const authorizedFields = ['name','price','products'];
        Promise.resolve().then(() => {
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

                const promiseAll = [];

                data.products.forEach((elem, i)=>{
                    promiseAll.push(ProductController.productNotExist(req,res,next,elem._id));
                });

                return Promise.all(promiseAll);
            })
            .then(() => MenuController.create(data, {authorizedFields}))
            .then(menu => MenuController.render(menu))
            .then(menu => res.status(201).json(menu))
            .catch(next);
    };

    /**
     * Render All Menu
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static async menus_get_all(req, res, next) {
        const fields = [
            '_id',
            'name',
            'price',
            'products'
        ];

        Promise.resolve()
            .then(() => MenuDao.getAllMenus())
            .then(menus => MenuController.read(menus, { fields },true))
            .then(menus => {
                const response = {
                    count: menus.length,
                    menus: menus.map(menu => {
                        return {
                            menu,
                            request: {
                                type: 'GET',
                                url: `${process.env.SERV_ADDRESS}/menu/${menu._id}`
                            }
                        };
                    })
                };
                if(response.count === 0){
                    res.status(204).end();
                }
                res.status(200).json(response);
            }).catch(err => {
            res.status(400).json({
                message: "Bad request",
                err,
            })
        });
    };

    /**
     * Modif one Menu from ID
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static async modif_menu(req, res, next){
        const id = req.params.menuId;
        let data = req.body;
        Promise.resolve().then(() =>{
            const promiseAll = [];
            // Check of menu alreadyExist to be sure we avoid duplicate Name
            if(data.name) promiseAll.push(MenuController.menuNameNotSameIdAlreadyExist(req,res,next,id));
            if(data.products) data.products.forEach((elem, i)=>{
                promiseAll.push(ProductController.productNotExist(req,res,next,elem._id));
            });

            return Promise.all(promiseAll);
        })
            .then(() =>  MenuController.menuNotExist(req,res,next,id))
            .then(menu => {
                menu.set(data);
                return menu.save();
            })
            .then(menu => MenuController.render(menu))
            .then(menu => res.status(200).json({
                menu,
                request: {
                    type: 'GET',
                    url: `${process.env.SERV_ADDRESS}/menu/${id}`
                }
            }))
            .catch(next);
    }

    /**
     * Delete Menu from his ID
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
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

    /**
     * Remove products from Menu.products
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static async delete_menu_product(req,res,next) {
        const id = req.params.menuId;
        let data = req.body;
        let menu = null;
        const promiseAll = [];
        Promise.resolve().then(() => {

            data.products.forEach((elem, i) => {
                promiseAll.push(ProductController.productNotExist(req,res,next,elem._id));
            });
            promiseAll.push( MenuController.menuNotExist(req,res,next,id));

            return Promise.all(promiseAll);
        })
            .then(() => {
            // taking products id in order to check them
            return MenuModel.find({_id: id}).then(doc => {
                let products = doc[0].products;
                // remove id one by one
                data.products.forEach(elem => {
                    let index = products.indexOf(elem._id);
                    if(index !== -1){
                        products.splice(index,1);
                    }
                });
                // cast into ObjectId
                let productsFinal = [];
                products.forEach(elem =>{
                    productsFinal.push(mongoose.Types.ObjectId(elem));
                });
                // push du new array objectId of product
                return MenuModel.updateOne({'_id': id},{'$set':{"products":productsFinal}});
            });
        })
            .then(() => MenuController.render(MenuDao.findById(id)))
            .then(menu => res.json({
                menu,
                request: {
                    type: 'GET',
                    url: `${process.env.SERV_ADDRESS}/menu/${id}`
                }
            }))
            .catch(next);
    }

    /**
     * Add products to Menu.products
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static async add_product(req,res,next){
        const id = req.params.menuId;
        let data = req.body;
        Promise.resolve().then(() =>{
            const promiseAll = [];
            data.products.forEach((elem, i)=>{
                promiseAll.push(ProductController.productNotExist(req,res,next,elem._id));
            });
            promiseAll.push(MenuController.menuNotExist(req,res,next,id));

            return Promise.all(promiseAll);
        })
            .then(() => {
                console.log(data.products);
                return MenuModel.updateOne({"_id":id},{$push:{products:{$each:data.products}}})
            })
            .then(() => MenuController.render(MenuDao.findById(id)))
            .then(menu => res.json({
                menu,
                request: {
                    type: 'GET',
                    url: `${process.env.SERV_ADDRESS}/menu/${id}`
                }
            }))
            .catch(next);
    }

    /**
     * Check if Menu Exists
     * @param req
     * @param res
     * @param next
     * @param id
     * @returns {Promise<Menu>}
     */
    static async menuNotExist(req,res,next,id){
        return Promise.resolve()
            .then(() => MenuDao.findById(id))
            .then(menu =>{
                if(!menu){
                    res.status(404).json({
                        message: `This menu ${id} doesn't exist`
                    }).end();
                    throw new Error(`This menu ${id} doesn't exist`);
                }
                return menu;
            });
    }

    /**
     * Avoid same Name and ID Menu
     * @param req
     * @param res
     * @param next
     * @param id
     * @returns {Promise<void>}
     */
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

// We tell him the name of the model to go load
MenuController.prototype.modelName = 'Menu';
module.exports = MenuController;



