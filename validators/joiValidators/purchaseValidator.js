import Joi from "joi"
import AppError from "../../managers/AppError.js"
import catchAsync from "../../managers/catchAsync.js"
import Item from "../../models/shopModels/itemModel.js"
import User from "../../models/userModel.js"

const joiPurchaseSchema = Joi.object({
    item:Joi.string().hex().length(24).message("Invalid Item ID").required(),
    user:Joi.string().required(),
    size:Joi.string(),
    count:Joi.number().integer().custom((value, helper)=>{
        if(value<=0) return helper.message("Count cannot be zero/negative")
    }).required(),
    totalCoins:Joi.number(),
    // delivery:{
    //     deliveryTo:{
    //         addressLine1:Joi.string().required(),
    //         addressLine2:Joi.string().required(),
    //         addressLine3:Joi.string().required()
    //     },
    //     isDelivered:Joi.forbidden(),
    //     deliveredAt:Joi.forbidden()
    // },
    purchasedAt:Joi.forbidden(),
})

export const joiPurchaseValidator = catchAsync(async(req, res, next)=>{
    req.body.user=req.user.id
    const size=req.body.size
    req.body.size=undefined
    console.log(req.body)
    await joiPurchaseSchema.validateAsync(req.body);
    const item= await Item.findById(req.body.item)
    if(item.name==='T-Shirts') req.body.size=size;
    const totalCoins = req.body.count*item.coins
    if(req.body.count>item.countInStock) return next(new AppError("Invalid Count."))
    if(totalCoins>req.user.coins) return next(new AppError("You dont have enough coins.", 400))
    req.body.totalCoins = totalCoins;
    next()
})