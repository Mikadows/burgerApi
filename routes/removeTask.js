var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send('');
    
    /*mongoose.connect('mongodb://127.0.0.1:27017/task')
        .then(result =>  {
            console.log(result);
        })
        .catch((err) => console.error(err));*/
});

/*router.post('/', function(req,res,next){
    if(!req.body) return res.sendStatus(400)
    regdata.save().then(item =>{
        res.status(200).send('Success')
    }).catch(err =>{
        res.status(400).send('Unable to save item')
    });
});*/

module.exports = router