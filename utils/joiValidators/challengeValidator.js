import Joi from "joi"
import AppError from "../../managers/AppError.js"
import catchAsync from "../../managers/catchAsync.js"
import User from "../../models/userModel.js"
import moment from "moment"

const joiChallengeSchema = Joi.object({
    raisedBy:Joi.string().required(),
    acceptedBy:Joi.forbidden(),
    challengeStatus:Joi.forbidden(),
    startsAt:Joi.date().custom((value, helper)=>{
        if(value<Date.now()) return helper.message("Invalid Start Time")
        // 3 days checker
    }).required(),
    endsAt:Joi.date().custom((value, helper)=>{
        // check if end date is not less than start date
        if(value<Date.now()) return helper.message("Invalid Start Time")
        // 3 days checker
    }).required(),
    pointsBet:Joi.number().required(),
    tags:Joi.array().items(Joi.string()).required(),
    raisedUserScore:Joi.forbidden(),
    acceptedUserScore:Joi.forbidden(),
})

const joiUserChallengeSchema = Joi.object({
    raisedBy:Joi.string().required(),
    acceptedBy:Joi.string().required(),
    challengeStatus:Joi.forbidden(),
    startsAt:Joi.date().custom((value, helper)=>{
        if(value<Date.now()) return helper.message("Invalid Start Time")
        //3 days checker
    }).required(),
    endsAt:Joi.date().custom((value, helper)=>{
        if(value<Date.now()) return helper.message("Invalid Start Time")
        //3 days checker
    }).required(),
    pointsBet:Joi.number().required(),
    raisedUserScore:Joi.forbidden(),
    acceptedUserScore:Joi.forbidden(),
})


export const joiChallengeValidator = catchAsync(async(req, res, next)=>{
    req.body.raisedBy=req.user.id;
    await joiChallengeSchema.validateAsync(req.body);
    if(req.user.id!=req.body.raisedBy) return next(new AppError("Please Log in as the challenging user", 400))
    if(req.body.startsAt>req.body.endsAt) return next(new AppError("Invalid Challenge Duration", 400))
    next()
})

export const joiUserChallengeValidator = catchAsync(async(req, res, next)=>{
    await joiUserChallengeSchema.validateAsync(req.body);
    if(req.user.id!=req.body.raisedBy) return next(new AppError("Please Log in as the challenging user", 400))
    if(!await User.findById(req.body.acceptedBy)) return next(new AppError("Invalid User Id of challenged user", 400))
    if(req.body.startsAt>req.body.endsAt) return next(new AppError("Invalid Challenge Duration", 400))
    next()
})