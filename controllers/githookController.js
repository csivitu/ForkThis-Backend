import catchAsync from "../managers/catchAsync.js";
import openIssue from './issueControllers/openIssue.js';
import closeIssue from "./issueControllers/closeIssue.js";
import reopenIssue from "./issueControllers/reopenIssue.js";
import openPR from "./PRControllers/openPR.js";
import closePR from "./PRControllers/closePR.js";
import reopenPR from "./PRControllers/reopenPR.js";
import mergePR from "./PRControllers/mergePR.js";
import labelIssue from "./issueControllers/labelIssue.js";
import axios from 'axios'
import envHandler from "../managers/envHandler.js";

export const oauthHandler =catchAsync(async(req, res, next)=>{
    const { code } = req.query
    const secret = envHandler('GITHUB_API_CLIENT_SECRET')
    const clientID = envHandler('GITHUB_API_CLIENT_ID')

    const URL = `https://github.com/login/oauth/access_token?code=${code}&client_secret=${secret}&client_id=${clientID}`

    const resposne = await axios.post(URL)
    const params = new URLSearchParams(resposne.data)
    const token =(params.get('access_token'))

    const userData = await axios.get('https://api.github.com/user', {
        headers:{
            "Authorization" : `Bearer ${token}`
        }
    })

    const userName = userData.data.login

    res.cookie("githubUsername", userName).redirect(`${envHandler("FRONTEND_URL")}/github/username`)
})

export const PRController=catchAsync(async(req, res, next)=>{
    const { action } = req.body;
    switch(action){
        case "opened":
            openPR(req, res, next)
            break;
        case "closed":
            req.body.pull_request.merged_at ? mergePR(req, res, next) : closePR(req, res, next)
            break;
        case "reopened":
            reopenPR(req, res, next)
            break;
    }
    // if(req.body.action=="opened") openPR(req, res, next)
    // if(req.body.action=="closed") req.body.pull_request.merged_at ? mergePR(req, res, next) : closePR(req, res, next)
    // if(req.body.action=="reopened") reopenPR(req, res, next)
})

export const issueController=catchAsync(async(req, res, next)=>{
    const { action } = req.body;
    switch(action){
        case "opened":
            openIssue(req, res, next)
            break;
        case "closed":
            closeIssue(req, res, next)
            break;
        case "reopened":
            reopenIssue(req, res, next)
            break;
        case /labeled/:
            labelIssue(req, res, next)
            break;
    }
    // if(req.body.action=="opened") openIssue(req, res, next)
    // if(req.body.action=="closed") closeIssue(req, res, next)
    // if(req.body.action=="reopened") reopenIssue(req, res, next)
    // if(req.body.action=="labeled" || req.body.action=="unlabeled") labelIssue(req, res, next)
})