const Admin = require('../models/Admin')
const sendCookie = require('../utils/sendCookie')

exports.loginPage = (req,res)=>{
    return res.render('auth/login',{msg:""})
}

exports.login = async(req,res)=>{
    try{
        const {username,password}=req.body

        const user = await Admin.findOne({username:username})
        if(!user){
            return res.render('auth/login',{msg:'Incorrect username'})
        }
 
        const validation = await user.isValidatedPassword(password)

        if(!validation){
            return res.render('auth/login',{msg:'Incorrect password'})
        }
        req.user = username
        return sendCookie(user,res)
       
    }catch(e){
        console.log(e)
        return res.send('error')
    }
}

exports.logout = (req,res)=>{
    return res.cookie('token', null).redirect('/login')

}