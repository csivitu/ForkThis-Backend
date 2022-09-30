import catchAsync from "../managers/catchAsync.js";
import APIFeatures from "./APIFeatures.js"
import User from "../models/userModel.js";
import AppError from "../managers/AppError.js";

export const getAllDocs = Model => catchAsync(async (req, res, next)=>{
    const features = new APIFeatures(Model.find(),req.query)

    features.filter().sort().fields().paginator();

    const docs = await features.query

    res.status(200).json({
        status: 'success',
        results: docs.length,
        requestedAt: req.requestedAt,
        data: docs,
    });
})

export const getAllDocsByUser = Model => catchAsync(async (req, res, next)=>{
    const user = await User.findOne({id:req.user.id})
    if(!user) return next(new AppError("No user of this username found", 401))
    const userID=user.id;
    const features = new APIFeatures(Model.find({user:userID}),req.query)

    features.filter().sort().fields().paginator();

    const docs = await features.query

    res.status(200).json({
        status: 'success',
        results: docs.length,
        requestedAt: req.requestedAt,
        data: docs,
    });
})

export const getDoc = Model => catchAsync(async (req, res, next)=>{
    const doc=await Model.findById(req.params.id);
    if(!doc) return next(new AppError("No document of this ID found", 401))
    res.status(200).json({
        status:"success",
        requestedAt: req.requestedAt,
        data:doc
    })
})

export const addDocByUser = Model => catchAsync(async (req, res, next)=>{
    const user=await User.findOne({username:req.params.username})
    if(!user) return next(new AppError("No user of this username found", 401))
    const userID=user.id;
    req.body.user=userID;
    const doc=await Model.create(req.body)
    res.status(200).json({
        status:"success",
        requestedAt: req.requestedAt,
        data:doc
    })
})

export const createDoc = Model => catchAsync( async(req, res, next)=>{
    const doc = await Model.create(req.body);
    res.status(201).json({
        status:"success",
        requestedAt: req.requestedAt,
        data: doc
    })
})

export const updateDoc = (Model, filteredBody)=> catchAsync(async (req, res, next)=>{
    const doc= await Model.findByIdAndUpdate(req.params.id, req.body, {
        new:true,
        runValidators:true
    })

    if(!doc) return next(new AppError("No document of this ID found", 401))

    res.status(200).json({
        status:"success",
        requestedAt: req.requestedAt,
        data:doc
    })
})

export const deleteDoc = Model => catchAsync(async (req, res, next)=>{
    await Model.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status:"success",
        requestedAt: req.requestedAt,
        data:null
    })
})