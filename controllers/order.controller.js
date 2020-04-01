let OrderModel = require('../models').Order;

exports.create_order = async (req,res,next) => {
    const order = new OrderModel({
        _id: mongoose.Types.ObjectId,
        quantity: req.body.quantity,
        product: req.body.productId,
    });
    order
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Order stored',
                createOrder: {
                    _id: result.id,
                    product: result.productId,
                    quantity: result.quantity
                }
            });
    })
        .catch(err => {
            res.status(500).json({
                message: 'Order Failed',
                err,
            });
        });
};


