let ProductModel = require('../models').Product;


exports.create_product = async (req, res) => {
    //TODO : Better check data

        let product = new ProductModel({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            price: req.body.price,
        });
        product.save();
        res.status(200).send("Parfait");
};

exports.products_get_all = (req, res, next) => {
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

exports.get_product_by_id = async (req,res)=> {
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