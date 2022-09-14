import catchAsync from "../managers/catchAsync.js";
import APIFeatures from "./APIFeatures.js"
import User from "../models/userModel.js";
import AppError from "../managers/AppError.js";
import Comment from "../models/commentModel.js";

export const getAllDocs = Model => catchAsync(async (req, res, next)=>{
    const features = new APIFeatures(Model.find(),req.query)

    features.filter().sort().fields().paginator();

    const docs = await features.query.populate({
        path:"followers",
        select:'username'
    }).populate('projects')

    res.status(200).json({
        status: 'success',
        results: docs.length,
        requestedAt: req.requestedAt,
        data: docs,
    });
})

export const getAllDocsByUser = Model => catchAsync(async (req, res, next)=>{
    const user = await User.findOne({username:req.params.username})
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

export const addLiker = Model => catchAsync(async (req, res, next)=>{
    const doc=await Model.findById(req.params.id)
    if(!doc) return next(new AppError("No document of this ID found", 401))
    let likers=[...doc.likers];
    if(!doc.isLiker) likers.push(req.user.id)
    else{
        const newLikers=[];
        likers.forEach(el=>{
            if(el!=req.user.id) newLikers.push(el);
        })
    }
    doc.update({likers:likers}, function(err, result){
        if(err) return new AppError(String(err), 400)
    })
    res.status(200).json({
        status:"success",
        requestedAt: req.requestedAt,
        data:likers
    })
})

export const addComment = Model => catchAsync(async (req, res, next)=> {
    req.body.user=req.user.id;
    const comment = await Comment.create(req.body);
    const doc= await Model.findById(req.params.id);
    let comments=[...doc.comments, comment];
    doc.update({comments:comments}, function(err, result){
        if(err) return new AppError(String(err), 400)
    })
    res.status(200).json({
        status:"success",
        requestedAt: req.requestedAt,
        data:comments
    })
})