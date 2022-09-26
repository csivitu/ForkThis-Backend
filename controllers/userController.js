import User from "../models/userModel.js";
import AppError from "../managers/AppError.js";
import catchAsync from "../managers/catchAsync.js";
import { createSendToken } from "./authController.js";
import { getAllDocs, getDoc, updateDoc, deleteDoc } from "../utils/HandlerFactory.js";
import sendEmail from "../utils/Email.js";
import resizePic from "../utils/resizePic.js";
import PR from "../models/prModel.js";
import Issue from "../models/issueModel.js";
import Challenge from "../models/challengeModel.js";
import moment from "moment";

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

const populateArr = arr =>{
    for(var i=0;i<10;i++){
        if(!arr[i]) arr[i]={
            createdAt:0
        }
    }
    return arr;
}

function mergeTwo(A, B)
{
    const m = A.length;
    const n = B.length;

    const D = [];

    let i = 0, j = 0;
    while (i < m && j < n) {

        if (A[i].createdAt <= B[j].createdAt)
            D.push(A[i++]);
        else
            D.push(B[j++]);
    }

    while (i < m)
        D.push(A[i++]);

    while (j < n)
        D.push(B[j++]);

    return D;
}

function filter(A){
    const B=[];
    for(var i =0;i<A.length;i++) if(A[i].createdAt!=0) B.push(A[i])
    return B;
}

export const getRecents= catchAsync(async(req, res, next)=>{
    var prs=await PR.find();
    var issues= await Issue.find();
    var challenges=await Challenge.find();
    issues.slice(0,10);
    prs.slice(0,10);
    challenges.slice(0,10);
    issues=populateArr(issues);
    challenges=populateArr(challenges);
    prs=populateArr(challenges);
    const temp=mergeTwo(issues, challenges);
    const recents=filter(mergeTwo(temp, prs)).slice(0,10)
    res.status(200).json({
        status:"success",
        requestedAt: req.requestedAt,
        data:recents
    })
})

function compareDates(A, B){ //A is stramp and B is pr date
    const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    const yrA=A.substring(0,4);
    const yrB=B.substring(11,15);
    const monA=A.substring(5,7);
    const monB=months.indexOf(B.substring(4,7).toLowerCase())+1
    const dateA=A.substring(8,10);
    const dateB=B.substring(8,10);
    const hrA=A.substring(11,13);
    const hrB=B.substring(16,18);
    // const minA=A.substring(14,16);
    // const minB=B.substring(19,21);
    // const secA=A.substring(17,19);
    // const secB=B.substring(22,24);

    if(yrA!=yrB || monA!=monB || dateA!=dateB) return -1;
    if(Number(hrB)>=Number(hrA) && Number(hrB)<Number(hrA)+3) return 1
    return -1
}

export const getDashboard = catchAsync(async(req, res, next)=>{
    const user= await User.findOne({username:req.user.username}).populate('PRs');
    const prs=user.PRs;
    const timeSlots=[];
    for(var i=0; i<24*3;i+=3) timeSlots.push(moment(new Date("2022-09-24 09:00:00".replace(/-/g,"/"))).add(i, "hours").format())
    const timeData=[];
    const diffData=[];
    const tagsData=[];
    timeSlots.forEach(el=>{
        const obj={
            timeStrap:el,
            noOfPRs:0
        }
        prs.forEach(pr=>{
            if(compareDates(el, String(pr.createdAt))==1) obj.noOfPRs++;
        })
        timeData.push(obj)
    })
    const diffObj={
        "beginner":0,
        "easy":0,
        "medium":0,
        "hard":0,
        "expert":0
    }
    const tagsObj={
        "Web Development":0,
        "ML":0,
        "web3":0,
        "documentation":0,
        "bug":0
    }
    prs.forEach(pr=>{
        diffObj[pr.issue.difficulty]++
        pr.issue.labels.forEach(tag=>{
            tagsObj[tag]++
        })
    })
    const diffKeys = Object.keys(diffObj);
    const diffVals = Object.values(diffObj);
    const tagsKeys = Object.keys(tagsObj);
    const tagsVals = Object.values(tagsObj);
    for(var i=0;i<5;i++){
        const obj={
            "difficulty":diffKeys[i],
            "noOfPRs":diffVals[i]
        }
        diffData.push(obj)
    }
    for(var i=0;i<tagsKeys.length;i++){
        const obj={
            "tag":tagsKeys[i],
            "noOfPRs":tagsVals[i]
        }
        tagsData.push(obj)
    }
    res.status( 200).json({
        status:"success",
        data:{
            timeData,
            diffData,
            tagsData
        }
    })
})