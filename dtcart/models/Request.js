const mongoose = require('mongoose')

const rSchema = new mongoose.Schema({
  id:String,
  userid:String,
  userName:String,
  text:String
})

module.exports=mongoose.model('Request', rSchema)