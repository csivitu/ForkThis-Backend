import AppError from "../managers/AppError.js";
import catchAsync from "../managers/catchAsync.js";
import Challenge from "../models/challengeModel.js";
import { createDoc, deleteDoc } from "../utils/HandlerFactory.js";

export const getChallenge= async(req, res, next)=>{
    const challenge=await Challenge.findById(req.params.id);
    if(!challenge) return next(new AppError("No Challenge with this ID found", 500))
    req.challenge=challenge;
    next()
}

export const raiseChallenge = createDoc(Challenge); // raise a challenge

export const raiseUserChallenge = createDoc(Challenge) // challenge someone

export const acceptChallenge = catchAsync(async(req, res, next)=>{
    const challenge=req.challenge;
    challenge.acceptedBy=req.user.id;
    challenge.challengeStatus='accepted'
    await challenge.save()
    res.status(201).json({
        status:"success",
        requestedAt: req.requestedAt,
        data: challenge
    })
})

export const acceptUserChallenge= catchAsync(async(req, res, next)=>{
    const challenge=req.challenge;
    if(challenge.acceptedBy!=req.user.id) return next(new AppError("You cannot accept this Challenge.", 500))
    challenge.challengeStatus='accepted'
    await challenge.save()
    res.status(201).json({
        status:"success",
        requestedAt: req.requestedAt,
        data: challenge
    })
})

export const rejectUserChallenge= catchAsync(async(req, res, next)=>{
    const challenge=req.challenge;
    if(challenge.acceptedBy!=req.user.id) return next(new AppError("You cannot reject this Challenge.", 500))
    challenge.challengeStatus='rejected'
    await challenge.save()
    res.status(201).json({
        status:"success",
        requestedAt: req.requestedAt,
        data: challenge
    })
})

export const deleteChallenge= catchAsync(async(req, res, next)=>{
    const challenge=req.challenge;
    if(challenge.challengeStatus!='raised') return next(new AppError("You cannot delete this Challenge.", 500))
    await challenge.delete()
    res.status(204).json({
        status:"success",
        requestedAt: req.requestedAt,
        data:null
    })
})
