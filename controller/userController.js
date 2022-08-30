const User = require('../models/user')
const BigPromise = require("../middlewares/bigpromise")
const cookieToken = require('../utils/cookieToken')
const CustomError = require('../utils/customerror')
const fileupload = require('express-fileupload')
const cloudinary = require('cloudinary')
const mailHelper = require("../utils/emailHelper")
const user = require('../models/user')
const crypto  = require('crypto')
const mongoose = require('mongoose')



module.exports.signup = BigPromise(async(req,res,next)=> {
    let result;
  
    if(!req.files){
return next(new CustomError("photo is required"))
    }
    const {name,email,password} = req.body;
    if(!email || !password || !name){
        return next (new CustomError("name , email, password is required",400))
    }
        let file = req.files.photo
       result = await cloudinary.v2.uploader.upload(file.tempFilePath,{
            folder:"users",
            width:150,
            crop:"scale"
        }
        )
    


  
    const user = await User.create({
        name,
        email,
        password,
        photo:{
            id:result.public_id,
            secure_url:result.secure_url
        }
    })
    
   cookieToken(user,res)
   
})


exports.login = BigPromise(async(req,res,next)=> {
    const {email,password}= req.body

    //check of presence of email and password
    if(!email || !password){
        return next(new CustomError('please provide email and password',400))
    }
   const user = await User.findOne({email}).select("+password")

   if(!user){
    return next (new CustomError("Email or Password does not match or exit",400))
   }
   const isPasswordCorrect  = await user.isValidatedPassword(password)

   if(!isPasswordCorrect){
    return next (new CustomError("Email or Password does not match or exit",400))
   }
// if all goes good and we send the token
  return cookieToken(user,res)
})

exports.logout = BigPromise(async(req,res,next)=> {
res.cookie("token",null,{
    expires:new Date(Date.now()),
    httpOnly:true,
});
res.status(200).json({
    success:true,
    message:"Login success"
})
})


exports.forgotPassword = BigPromise(async(req,res,next)=> {
   const {email} = req.body
  const user = await User.findOne({email})

if(!user){
    return next(new CustomError("Email not found as registered ",400))
}

  const forgotToken = user.getForgotpasswordToken()

 // saves automaticall without checking
  await user.save({validateBeforeSave: false})
  console.log(user)
const myUrl = `${req.protocol}//${req.get("host")}/password/reset/${forgotToken}`
const message = `${email}Copy paste this link in your URl and hit enter \n \n ${myUrl}`
try{
await mailHelper(
    {
        email:user.email,
        subject:"VISHWA - password reset email",
       message
    }
   
)
res.status(200).json({
    success:true,
    message:"Email send successfully"
})
}

catch(error){
    user.forgotPasswordToken = undefined
    user.forgotPasswordExpiry = undefined 
    await user.save({validateBeforeSave:false})

    return next(new CustomError(error.message,500))
}
    })


    exports.passwordReset = BigPromise(async(req,res,next)=> {
const token = req.params.token;

const encryToken = crypto.createHash('sha256').update(token).digest('hex')
const user = await User.findOne({encryToken, forgotPasswordExpiry:{$gt:Date.now()}})
       
         if(!user){
            return next(new CustomError("Token is invalid or expired"))
         }
          

         if(req.body.password !== req.body.conformPassword){
            return next(new CustomError("Password and conform password do not match ",400))

         }
         user.password = req.body.password
         user.forgotPasswordToken = undefined
         user.forgotPasswordExpiry = undefined
         await user.save();

         //send a JSON response  or Send token 
         cookieToken(user,res)
         
        })

  