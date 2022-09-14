import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcryptjs';
import slugify from "slugify";
import crypto from 'crypto';
import AppError from "../managers/AppError.js";

const userSchema = new mongoose.Schema({
    //BASIC
    name:{
        type:String,
        required:[true, "Please provide the name"],
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:[true, "Please provide the email"],
        trim:true,
        lowercase:true,
        validate:[validator.isEmail, "Please provide a valid email"]
    },
    profilePic:{
        type:String
    }, 
    phoneNo:{
        type:Number
    },
    username:{
        type:String,
        unique:true,
        required:true,
        lowercase:true,
    },
    tags:[String],
    score:{
        type:Numner,
        default:0
    },
    password:{
        type:String,
        required:[true, "Please provide a password"],
        minlength:8,
        select:false
    },
    confirmPassword:{
        type:String,
        required:[true, "Please confirm the password"],
        validate:{
            validator: function(el){
                return el==this.password;
            },
            message:"Passwords do not match"
        }
    },
    passwordChangedAt:{
        type:Date,
        default:Date.now()
    },
    passwordResetToken:String,
    passwordResetTokenExpiresIn:Date

},{
    toJSON : {virtuals:true},
    toObject : {virtuals:true} 
});

userSchema.pre("save", async function(next){
    if(!this.isModified('password'))  return next()
    if(this.password!=this.confirmPassword) return next(new AppError("Passwords do not match", 400))
    this.password= await bcrypt.hash(this.password, 12)
    this.confirmPassword=undefined
    next()
})

userSchema.methods.correctPassword = async function (inPass, userPass){
    return await bcrypt.compare(inPass, userPass)
};

userSchema.methods.changedPasswordAfter =  function (JWTTimestrap){
    const changedTimestrap=parseInt(this.passwordChangedAt.getTime() / 1000, 10)
    return JWTTimestrap<changedTimestrap
}

userSchema.methods.createPasswordResetToken= async function(){
    const token= crypto.randomBytes(32).toString('hex');
    this.passwordResetToken= await bcrypt.hash(token, 4)
    this.passwordResetTokenExpiresIn= Date.now() + 10*60*1000;
    return token
}

userSchema.methods.resetTokenExpired= function(){
    if(this.passwordResetTokenExpiresIn) return Date.now()>this.passwordResetTokenExpiresIn;
}

userSchema.methods.correctPasswordResetToken = async function (inToken, userToken){
    return await bcrypt.compare(inToken, userToken)
};

const User = mongoose.model("User", userSchema);

export default User;