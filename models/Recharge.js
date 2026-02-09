const mongoose = require('mongoose')

const pSchema = new mongoose.Schema({
  id:String,
  user:String,
  userName:String,
  amount:Number,
  transactionid:String,
  text:String,
  accepted:{
    type:Boolean,
    default:false
  }
})

module.exports=mongoose.model('Purchase', pSchema)