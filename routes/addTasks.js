var express = require('express')
var router = express.Router()
const Task = require('../models/Task')
/**
 * Ajout de tache
 */
router.post('/', async (req, res, next) => {
    console.log(req.body.name)
    const task = new Task({
        name: req.body.name,
        isFinish: false
    })
   

    try{
        const savedTask = await task.save().exec()
        res.send(savedTask)
    }catch(err){
        res.json({message:err})
    }
})

module.exports = router