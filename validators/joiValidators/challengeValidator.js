import Joi from "joi"
import AppError from "../../managers/AppError.js"
import catchAsync from "../../managers/catchAsync.js"
import Challenge from "../../models/challengeModel.js"
import envHandler from "../../managers/envHandler.js"

const joiChallengeSchema = Joi.object({
    raisedBy:Joi.string().forbidden(),
    acceptedBy:Joi.forbidden(),
    challengeStatus:Joi.forbidden(),
    startsAt:Joi.date().custom((value, helper)=>{
        if(value<=Date.now()) return helper.message("Invalid Start Time")
        if(value>=new Date(envHandler('EVENT_END_TIME'))) return helper.message("Invalid Start Time")
    }).required(),
    endsAt:Joi.date().custom((value, helper)=>{
        if(value<Date.now()) return helper.message("Invalid End Time")
        if(value>new Date(envHandler('EVENT_END_TIME'))) return helper.message("Invalid End Time")
    }).required(),
    coinsBet:Joi.number().custom((value, helper)=>{
        if(value<=0) return helper.message("Coins Bet cannot be zero/negative")
    }).required(),
    tags:Joi.array().items(Joi.string()).required(),
    difficulty:Joi.string(),
    raisedUserScore:Joi.forbidden(),
    acceptedUserScore:Joi.forbidden(),
    raisedUserActivity:Joi.forbidden(),
    acceptedUserActivity:Joi.forbidden()
})

export const joiChallengeValidator = catchAsync(async(req, res, next)=>{
    const challenges =  await Challenge.find({$and:[{challengeStatus:'accepted'}, { $or: [ { raisedBy: req.user.id }, { acceptedBy: req.user.id } ] }]}).sort({startsAt:-1});
    if(challenges.length>=1) return next(new AppError("You already are a part of an active Challenge.", 400))
    await joiChallengeSchema.validateAsync(req.body);
    req.body.raisedBy=req.user.id;
    if(req.body.coinsBet>req.user.coins) return next(new AppError("Invalid Bet coins", 400))
    if(req.body.startsAt>=req.body.endsAt) return next(new AppError("Invalid Challenge Duration", 400))
    req.body.raisedUserActivity=[{data:'Raised the Challenge', URL:''}];
    next()
})
