import catchAsync from "../managers/catchAsync.js";
import PR from "../models/prModel.js";
import User from "../models/userModel.js";
import { setScore } from "./scoreController.js";

export const tester= catchAsync(async(req, res, next)=>{
    res.status(200).json({
        status:"success"
    })
})

export const addPullRequest=catchAsync(async(req, res, next)=>{
    const username=""; //getting username from the request
    const user = await User.find({username:username});
    const userID=user.id;
    const pr = PR.create({
        repo: "",
        issue:"",
        user:userID,
        difficulty:""
    })
    res.status(200).json({
        status:"success"
    })
})

export const acceptPullRequest=catchAsync(async(req, res, next)=>{
    const username=""; //getting username from the request
    var user = await User.findOne({username:username});  // or can we directly store the username in the PR model?
    const repo= "";
    const issue ="";
    const pr = await PR.findOneAndUpdate({repo:repo, user:user.id, issue:issue},{PRType:'merged'})
    user= setScore(pr, user);
    await user.save();
    res.status(200).json({
        status:"success"
    })
})