import User from "../models/userModel.js";
import AppError from "../managers/AppError.js";
import catchAsync from "../managers/catchAsync.js";
import { createSendToken } from "./authController.js";
import { getAllDocs, getDoc, updateDoc, deleteDoc } from "../utils/HandlerFactory.js";
import sendEmail from "../utils/Email.js";
import PR from "../models/prModel.js";
import Issue from "../models/issueModel.js";
import Challenge from "../models/challengeModel.js";
import moment from "moment";
import envHandler from "../managers/envHandler.js";

export const getAllUsers=getAllDocs(User)

export const getUser= catchAsync(async (req, res, next)=>{
    const doc=await User.findById(req.params.userID);
    if(!doc) return next(new AppError("No document of this ID found", 401))
    res.status(200).json({
        status:"success",
        requestedAt: req.requestedAt,
        data:doc
    })
})

export const updateUser = updateDoc(User);

export const deleteUser = deleteDoc(User);

export const getMe =catchAsync(async(req, res, next)=>{
    const user= req.user;
    const users=await User.find().populate("PRs").sort({score:-1});
    const ids=[];
    users.forEach(el=>{
        ids.push(el.id)
    })
    const rank = ids.indexOf(user.id)+1
    const data={...user._doc, rank}
    res.status(200).json({
        status:"success",
        requestedAt: req.requestedAt,
        data
    })
})

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
        if (A[i].createdAt >= B[j].createdAt)
            D.push(A[i++]);
        else
            D.push(B[j++]);
    }
    while (i < m) D.push(A[i++]);
    while (j < n) D.push(B[j++]);

    return D;
}

function filter(A){
    const B=[];
    for(var i =0;i<A.length;i++) if(A[i].createdAt!=0) B.push(A[i])
    return B;
}

export const getRecents= catchAsync(async(req, res, next)=>{
    const prsPre=await PR.find().sort({createdAt:-1}).populate('user');
    const issuesPre= await Issue.find().sort({createdAt:-1}).populate('raisedBy');
    const challengesPre=await Challenge.find({challengeStatus:"raised"}).sort({createdAt:-1}).populate('raisedBy');
    var prs=[];
    var issues=[];
    var challenges=[];
    prsPre.forEach(el=>{
        const type="pr";
        prs.push({...el._doc,type});
    })
    issuesPre.forEach(el=>{
        const type="issue";
        issues.push({...el._doc,type});
    })
    challengesPre.forEach(el=>{
        const type="challenge";
        challenges.push({...el._doc,type});
    })
    issues.slice(0,10);
    prs.slice(0,10);
    challenges.slice(0,10);
    issues=populateArr(issues);
    challenges=populateArr(challenges);
    prs=populateArr(prs);
    const temp=mergeTwo(issues, challenges);
    const recents=filter(mergeTwo(temp, prs)).slice(0,10)

    const recentData = [];
    recents.forEach((el) => {
    const obj = {
        data: "",
        URL: "/",
    };
    if (el.type == "pr") {
        obj.data = `${el.user.username} raised a new Pull Request.`;
        if (el.prURL) obj.URL = el.prURL;
    } else if (el.type == "issue") {
        obj.data = `${el.raisedBy.username} raised a new Issue in ${el.repo}.`;
        obj.URL = el.issueURL;
    } else if (el.type == "challenge") {
        obj.data = `${el.raisedBy.username} raised a new Challenge.`;
        // obj.URL=  // redirect to challenges page
    }
    recentData.push(obj);
    });


    res.status(200).json({
        status:"success",
        requestedAt: req.requestedAt,
        data:recentData
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

    if(yrA!=yrB || monA!=monB || dateA!=dateB) return -1;
    if(Number(hrB)>=Number(hrA) && Number(hrB)<Number(hrA)+3) return 1
    return -1
}

const timeVSpr = (prs) =>{
    const timeData=[];
    const timeSlots=[];
    for(var i=0; i<24*3;i+=3) timeSlots.push(moment(new Date(envHandler("EVENT_START_TIME").replace(/-/g,"/"))).add(i, "hours").format())
    const a = {
        noOfPRsOfProject1:0,
        noOfPRsOfProject2:0,
        noOfPRsOfProject3:0,
        noOfPRsOfProject4:0,
        noOfPRsOfProject5:0
    }
    //project1 = interact_main
    //project2 = someOther Project
    timeSlots.forEach(el=>{
        prs.forEach(pr=>{
            if(compareDates(el, String(pr.createdAt))==1){
                if(pr.issue.repo=='interact-old') a.noOfPRsOfProject1++;
                else if(pr.issue.repo=='interact_main2') a.noOfPRsOfProject2++;
                else if(pr.issue.repo=='interact_main3') a.noOfPRsOfProject3++;
                else if(pr.issue.repo=='interact_main4') a.noOfPRsOfProject4++;
                else if(pr.issue.repo=='interact_main5') a.noOfPRsOfProject5++;

            };
        })
        const obj={
            timeStrap:el,
            noOfPRsOfProject1:a.noOfPRsOfProject1,
            noOfPRsOfProject2:a.noOfPRsOfProject2,
            noOfPRsOfProject3:a.noOfPRsOfProject3,
            noOfPRsOfProject4:a.noOfPRsOfProject4,
            noOfPRsOfProject5:a.noOfPRsOfProject5
        }
        timeData.push(obj)
    })
    for(var i=0;i<24;i++){
        if(i*3>=48) timeData[i].timeStrap=`2 days ${i*3==48?``:`${i*3-48} hours`}`
        else if(i*3>=24) timeData[i].timeStrap=`1 day ${i*3==24?``:`${i*3-24} hours`}`
        else timeData[i].timeStrap=`${i*3} hours`
    }
    return timeData;
}

const diffVSpr = (prs) =>{
    const diffData=[];
    const diffObj={
        "beginner":0,
        "easy":0,
        "medium":0,
        "hard":0,
        "expert":0
    }
    prs.forEach(pr=>{
        diffObj[pr.issue.difficulty]++
    })
    const diffKeys = Object.keys(diffObj);
    const diffVals = Object.values(diffObj);
    for(var i=0;i<5;i++){
        const obj={
            "difficulty":diffKeys[i],
            "noOfPRs":diffVals[i]
        }
        diffData.push(obj)
    }
    return diffData;
}

const tagsVSpr= (prs)=> {
    const tagsData=[];
    const tagsObj={
        "Web Development":0,
        "ML":0,
        "web3":0,
        "documentation":0,
        "bug":0
    }
    prs.forEach(pr=>{
        pr.issue.labels.forEach(tag=>{
            tagsObj[tag]++
        })
    })
    const tagsKeys = Object.keys(tagsObj);
    const tagsVals = Object.values(tagsObj);
    for(var i=0;i<tagsKeys.length;i++){
        const obj={
            "tag":tagsKeys[i],
            "noOfPRs":tagsVals[i]
        }
        tagsData.push(obj)
    }
    return tagsData;
}

export const getDashboard = catchAsync(async(req, res, next)=>{
    const user= await User.findOne({username:req.user.username}).populate('PRs');
    const prs=user.PRs;
    const timeData=timeVSpr(prs);
    const diffData=diffVSpr(prs);
    const tagsData=tagsVSpr(prs);
    res.status( 200).json({
        status:"success",
        data:{
            timeData,
            diffData,
            tagsData
        }
    })
})