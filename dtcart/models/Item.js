const mongoose = require('mongoose')

const iSchema = new mongoose.Schema({
  id:String,
  img:String,
  name:String,
  price:Number,
  quantity:Number,
  tags:[String]
})

module.exports=mongoose.model('Item', iSchema)