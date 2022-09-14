import User from "../models/userModel.js";
import AppError from "../managers/AppError.js";
import catchAsync from "../managers/catchAsync.js";
import { createSendToken } from "./authController.js";
import { getAllDocs, getDoc, updateDoc, deleteDoc } from "../utils/HandlerFactory.js";
import sendEmail from "../utils/Email.js";
import resizePic from "../utils/resizePic.js";

export const resizeUserPic = resizePic("project", 500, 500)

export const getAllUsers=getAllDocs(User)

export const getUser= getDoc(User)

export const updateUser = updateDoc(User);

export const deleteUser = deleteDoc(User);

export const UpdatePassword= catchAsync(async (req, res, next)=>{
    const user=await User.findById(req.user.id).select("+password");
    if(! await user.correctPassword(req.body.password, user.password)) return next(new AppError("Incorect Password, Please enter the corrent password", 401));
    
    user.password = req.body.newPassword;
    user.confirmPassword=req.body.passwordConfirm;
    user.passwordChangedAt=Date.now()
    await user.save()
    
    createSendToken(user, 200, res)
})

export const forgotPassword= catchAsync(async (req, res, next)=>{
    const user= await User.findOne({email:req.body.email});
    if(!user) return next(new AppError("No User of this email id found", 401))
    const resetToken=await user.createPasswordResetToken()
    await user.save({validateBeforeSave: false});

    const URL= `${req.protocol}://${req.get('host')}/resetPassword/${user.id}/${resetToken}`;
    const EmailSubject=`Reset your Password!`;
    const EmailBody= `Forgot your Password? Click here to reset: ${URL}`;
    try{
        await sendEmail({
            email:user.email,
            subject:EmailSubject,
            body:EmailBody
        });
        res.status(200).json({
            status:"success",
            requestedAt: req.requestedAt,
            message :"Reset URL send to registered email."
        })
    }catch(err){
        user.passwordResetToken=undefined;
        user.passwordResetTokenExpiresIn=undefined;
        await user.save({validateBeforeSave: false});

        return next(new AppError("There was an error sending the email", 500))
    }
})

export const resetPassword= catchAsync(async (req, res, next)=>{
    const user= await User.findOne({_id:req.body.userID});
    if(!user) return next(new AppError("Invalid URL", 401));

    if(!user.passwordResetToken || user.resetTokenExpired()) return next(new AppError("URL has Expired", 401));
    if(!user.correctPasswordResetToken(req.body.token, user.passwordResetToken)) return next(new AppError("Invalid URL", 401));
    
    user.password=req.body.password;
    user.confirmPassword=req.body.passwordConfirm;
    user.passwordResetToken=undefined;
    user.passwordResetTokenExpiresIn=undefined;
    await user.save();
    
    createSendToken(user, 200, res);
})
