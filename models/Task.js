const mongoose = require('mongoose')

const taskSchema = mongoose.Schema({
    name: String,
    isFinish: Boolean,
  },{ collection: 'task' })

module.exports = mongoose.model('task', taskSchema)