import Joi from "joi"

const joiPurchaseSchema = Joi.object({
    item:Joi.string().required(),
    user:Joi.string().required(),
    count:Joi.number().custom((value, helper)=>{
        if(value<0) return helper.message("Count cannot be negative")
    }),
    totalCoins:Joi.number().custom((value, helper)=>{
        if(value<0) return helper.message("Total Coins cannot be negative")
    }),
    delivery:{
        deliveryTo:{
            addressLine1:Joi.string().required(),
            addressLine2:Joi.string().required(),
            addressLine3:Joi.string().required()
        },
        isDelivered:Joi.forbidden(),
        deliveredAt:Joi.forbidden()
    },
    purchasedAt:Joi.forbidden(),
})

export const joiPurchaseValidator = catchAsync(async(req, res, next)=>{
    await joiPurchaseSchema.validateAsync(req.body);
    next()
})