const mongoose = require('mongoose')

const pSchema = new mongoose.Schema({
  id:String,
  user:String,
  userName:String,
  amount:Number,
  items:[
    {
        item:String,
        itemid:String,
        quantity:Number,
        amount:Number
    }
  ]
})

module.exports=mongoose.model('Purchase', pSchema)