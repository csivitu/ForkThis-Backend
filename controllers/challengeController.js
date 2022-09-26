import AppError from "../managers/AppError.js";
import catchAsync from "../managers/catchAsync.js";
import Challenge from "../models/challengeModel.js";
import { createDoc, deleteDoc, getAllDocs, getDoc } from "../utils/HandlerFactory.js";

export const getChallenge= getDoc(Challenge)

export const getChallenges= catchAsync(async (req, res, next)=>{

    const docs = await Challenge.find().sort({startsAt:-1})

    res.status(200).json({
        status: 'success',
        results: docs.length,
        requestedAt: req.requestedAt,
        data: docs,
    });
})

export const getRaisedChallenges= catchAsync(async (req, res, next)=>{

    const docs = await Challenge.find({challengeStatus:'raised'}).sort({startsAt:-1})

    res.status(200).json({
        status: 'success',
        results: docs.length,
        requestedAt: req.requestedAt,
        data: docs,
    });
})

export const getActiveChallenges= catchAsync(async (req, res, next)=>{

    const docs = await Challenge.find({$and:[{challengeStatus:'accepted'}, { $or: [ { raisedBy: req.user.id }, { acceptedBy: req.user.id } ] }]}).sort({startsAt:-1})

    res.status(200).json({
        status: 'success',
        results: docs.length,
        requestedAt: req.requestedAt,
        data: docs,
    });
})

export const getClosedChallenges= catchAsync(async (req, res, next)=>{

    const docs = await Challenge.find({$and:[{$or: [ { challengeStatus: "rejected" }, { challengeStatus: "ended" } ]}, { $or: [ { raisedBy: req.user.id }, { acceptedBy: req.user.id } ] }]}).sort({startsAt:-1})   

    res.status(200).json({
        status: 'success',
        results: docs.length,
        requestedAt: req.requestedAt,
        data: docs,
    });
})

export const raiseChallenge = createDoc(Challenge); // raise a challenge

export const raiseUserChallenge = createDoc(Challenge); // challenge someone

export const acceptChallenge = catchAsync(async(req, res, next)=>{
    const challenge=req.challenge;
    challenge.acceptedBy=req.user.id;
    challenge.challengeStatus='accepted'
    await challenge.save()
    console.log(challenge)
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
    if(req.user.id!=challenge.raisedBy || challenge.challengeStatus!='raised') return next(new AppError("You cannot delete this Challenge.", 500))
    await challenge.delete()
    res.status(204).json({
        status:"success",
        requestedAt: req.requestedAt,
        data:null
    })
})
