import AppError from "../managers/AppError.js";
import catchAsync from "../managers/catchAsync.js";
import Challenge from "../models/challengeModel.js";
import { createDoc, deleteDoc, getAllDocs, getDoc } from "../utils/HandlerFactory.js";

export const getReqChallenge= catchAsync(async (req, res, next)=>{
    const challenge = await Challenge.findById(req.params.id);
    if(!challenge) next(new AppError("No Challenge of this ID found.", 400))
    req.challenge=challenge;
    next()
})

export const getChallenge = getDoc(Challenge);

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

export const raiseChallenge = createDoc(Challenge);

export const acceptChallenge = catchAsync(async(req, res, next)=>{
    const challenge=req.challenge;
    challenge.acceptedBy=req.user.id;
    challenge.challengeStatus='accepted'
    await challenge.save()
    const raisedChallenges = await Challenge.find({$and:[{challengeStatus:'raised'}, { $or: [ { raisedBy: req.user.id }, {raisedBy: challenge.raisedBy}]}]})
    raisedChallenges.forEach(async(el)=>await el.delete())
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
