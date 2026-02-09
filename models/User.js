const mongoose = require('mongoose')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

const uSchema = new mongoose.Schema({
    id:String,
    name:String,
    phone:String,
    otp:String,
    balance:{
        type:Number,
        default:0
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

//create and return jwt_token
uSchema.methods.getJwtToken = function(){
    return jwt.sign(
        {   id:this.id,
            name:this.name,
            phone:this.phone
        },
        process.env.JWT_SECRET
    )
}

module.exports=mongoose.model('User',uSchema)