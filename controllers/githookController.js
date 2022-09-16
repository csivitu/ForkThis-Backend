import AppError from "../managers/AppError.js";
import catchAsync from "../managers/catchAsync.js";
import Issue from "../models/issueModel.js";
import PR from "../models/prModel.js";
import User from "../models/userModel.js";
import { setScore } from "./scoreController.js";

export const gitHookTester= (req, res, next)=>{
    res.status(200).json({
        status:"success"
    })
}

export const addPullRequest=catchAsync(async(req, res, next)=>{
    const username=""; //getting username from the request
    const user = await User.find({username:username});
    const userID=user.id;
    const pr = await PR.create({
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
    await Issue.findOneAndUpdate({repo:repo, raisedBy:user.id}, {isSolved:true})
    res.status(200).json({
        status:"success"
    })
})

export const raiseIssue=catchAsync(async(req, res, next)=>{
    if(req.body.action!="opened") return next(new AppError("URL Only for opening issues"))
    const username=req.body.issue.user.login;
    const user = await User.findOne({username:username});
    const userID=user.id;
    const issue = await Issue.create({
        repo_url: req.body.issue.repository_url,
        repo:req.body.repository.name,
        title:req.body.issue.title,
        raisedBy:userID,
        label:""
    })
    res.status(200).json({
        status:"success"
    })
})