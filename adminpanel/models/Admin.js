const mongoose = require('mongoose')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

const adminSchema = new mongoose.Schema({
    id:String,
    username:String,
    name:String,
    password:{
        type:String,
        selected:false,
    }
});


adminSchema.pre('save',async function(next){

    if(!(this.isModified('password'))){
        return next()
    }

    this.password= await bcrypt.hash(this.password,10)

})

//validate the password with passedon userpassword
adminSchema.methods.isValidatedPassword = async function(userSendPassword){
    return await bcrypt.compare(userSendPassword,this.password)
}

//create and return jwt_token
adminSchema.methods.getJwtToken = function(){
    return jwt.sign(
        {    
            id:this.id,
            name:this.name,
        },
        process.env.JWT_SECRET,
        {expiresIn:'8h'}
    )
} 

module.exports = mongoose.model('Admin', adminSchema);