import Joi from 'joi'
import User from '../../models/userModel.js';
import catchAsync from '../../managers/catchAsync.js'
import { isValidNumber } from 'libphonenumber-js';

const joiUserCreateSchema = Joi.object({
    name:Joi.string().pattern(/^[A-Za-z]+$/, 'alpha').required(),
    email:Joi.string().email().lowercase().custom(async (value, helper)=>{
        const user= await User.find({email: value});
        if(user) return helper.message("User with this email already exists")
    }).required(),
    username: Joi.string().custom(async (value, helper)=>{
        const user= await User.find({username: value});
        if(user) return helper.message("User with this username already exists")
    }).required(),
    profilePic:Joi.string(),
    score:Joi.forbidden(),
    password:Joi.string().min(8).required(),
    confirmPassword: Joi.ref('password'),
    bio: Joi.string().max(50),
    phoneNo:Joi.string().custom((value, helper)=>{
        if(!isValidNumber(value)) return helper.message("Enter a valid phone number")
    }),
})

const joiUserUpdateSchema =Joi.object({
    name:Joi.forbidden(),
    email:Joi.string().email().lowercase().custom(async (value, helper)=>{
        const user= await User.find({email: value});
        if(user) return helper.message("User with this email already exists")
    }),
    username: Joi.forbidden(),
    score:Joi.forbidden(),
    profilePic:Joi.string(),
    password:Joi.forbidden(),
    phoneNo:Joi.string().custom((value, helper)=>{
        if(!isValidNumber(value)) return helper.message("Enter a valid phone number")
    }),
})

export const joiUserCreateValidator = (async (req, res, next)=>{
    await joiUserCreateSchema.validateAsync(req.body).catch(error=>{
        if(req.file){   //or req.file
            const picPath = req.files['profilePic'][0].destination+'/'+req.files['profilePic'][0].filename;
            fs.unlinkSync(picPath, function(err){
                return next(err)
            })
        }
        return next(error)
    })
    next()
})

export const joiUserUpdateValidator = (async (req, res, next)=>{
    await joiUserUpdateSchema.validateAsync(req.body).catch(error=>{
        if(req.files['profilePic']){   //or req.file
            const picPath = req.files['profilePic'][0].destination+'/'+req.files['profilePic'][0].filename;
            fs.unlinkSync(picPath, function(err){
                return next(err)
            })
        }
        return next(error)
    })
    next()
})