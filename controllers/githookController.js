import catchAsync from "../managers/catchAsync.js";
import openIssue from './issueControllers/openIssue.js';
import closeIssue from "./issueControllers/closeIssue.js";
import reopenIssue from "./issueControllers/reopenIssue.js";
import openPR from "./PRControllers/openPR.js";
import closePR from "./PRControllers/closePR.js";
import reopenPR from "./PRControllers/reopenPR.js";
import mergePR from "./PRControllers/mergePR.js";
import labelIssue from "./issueControllers/labelIssue.js";

export const PRController=catchAsync(async(req, res, next)=>{
    const { action } = req.body;
    if(req.body.action=="opened") openPR(req, res, next)
    if(req.body.action=="closed") req.body.pull_request.merged_at ? mergePR(req, res, next) : closePR(req, res, next)
    if(req.body.action=="reopened") reopenPR(req, res, next)
})

export const issueController=catchAsync(async(req, res, next)=>{
    if(req.body.action=="opened") openIssue(req, res, next)
    if(req.body.action=="closed") closeIssue(req, res, next)
    if(req.body.action=="reopened") reopenIssue(req, res, next)
    if(req.body.action=="labeled" || req.body.action=="unlabeled") labelIssue(req, res, next)
})