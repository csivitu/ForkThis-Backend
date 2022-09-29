import Joi from "joi"
import catchAsync from "../../managers/catchAsync.js"

const joiItemSchema = Joi.object({
    name:Joi.string().required(),
    description:Joi.string().required(),
    countInStock:Joi.number().custom((value, helper)=>{
        if(value<0) return helper.message("Count In Stock cannot be negative")
    }),
    coins:Joi.number().custom((value, helper)=>{
        if(value<=0) return helper.message("Coins cannot be zero/negative")
    })
})

export const joiItemValidator = catchAsync(async(req, res, next)=>{
    await joiItemSchema.validateAsync(req.body);
    next()
})