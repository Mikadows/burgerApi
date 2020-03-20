var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send('Vous etes bien connecté à l\'api');
});

module.exports = router