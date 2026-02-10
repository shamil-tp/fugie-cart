const mongoose = require('mongoose')

const iSchema = new mongoose.Schema({
  id:String,
  img:String,
  name:String,
  price:Number,
  quantity:Number
})

module.exports=mongoose.model('Item', iSchema)