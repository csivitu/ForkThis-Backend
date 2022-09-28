import Joi from "joi"
import AppError from "../../managers/AppError.js"
import catchAsync from "../../managers/catchAsync.js"
import Item from "../../models/shopModels/itemModel.js"
import User from "../../models/userModel.js"

const joiPurchaseSchema = Joi.object({
    item:Joi.string().required(),
    user:Joi.string().required(),
    count:Joi.number().custom((value, helper)=>{
        if(value<0) return helper.message("Count cannot be negative")   
    }),
    size:Joi.string(),
    totalCoins:Joi.number().required(),
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
    const item= await Item.findById(req.body.item)
    if(!item) return next(new AppError("Invalid Item ID", 400))
    if(item.name!='T-Shirts')req.body.size=undefined;
    const totalCoins = req.body.count*item.coins
    if(totalCoins>req.user.coins) return next(new AppError("You dont have enough coins.", 400))
    req.body.totalCoins = totalCoins;
    if(req.body.count>item.countInStock) return next(new AppError("Invalid Count."))
    await joiPurchaseSchema.validateAsync(req.body);
    next()
})