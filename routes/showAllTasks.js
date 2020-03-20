var express = require('express')
var router = express.Router()
const Task = require('../models/Task')
/**
 * Resquest partie
 */
router.get('/', async (req, res, next) => {
    try{
        Task.find().then((toDos) => res.status(200).send(toDos))
      } catch(error){
        res.send(error)
      }
})

module.exports = router