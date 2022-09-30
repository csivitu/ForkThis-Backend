import catchAsync from "../../managers/catchAsync.js";
import User from "../../models/userModel.js";
import Issue from "../../models/issueModel.js";
import Challenge from "../../models/challengeModel.js";

const openIssue=catchAsync(async(req, res, next)=>{
    const username=req.body.issue.user.login;
    const user = await User.findOne({username:username});
    const userID=user.id;
    const gitLabels=req.body.issue.labels;
    const labels=[];
    gitLabels.forEach(el=>{
        if(el!='beginner' && el!='easy' && el!='medium' && el!='hard' && el!='expert') labels.push(el.name)
    })
    await Issue.create({
        repoURL: req.body.issue.repository_url,
        repo:req.body.repository.name,
        issueURL:req.body.issue.url,
        title:req.body.issue.title,
        raisedBy:userID,
        labels:labels,
        difficulty: labels.includes('beginner') ? 'beginner' : 
                    labels.includes('easy') ? 'easy' : 
                    labels.includes('medium') ? 'medium' : 
                    labels.includes('hard') ? 'hard' : 
                    labels.includes('expert') ? 'expert' : '' 
    })
    const challenge = await Challenge.findOne({$and:[{challengeStatus:'accepted'}, { $or: [ { raisedBy: req.user.id }, { acceptedBy: req.user.id } ] }]})
    const obj = {
        data:`Raised a new Issue in ${req.body.repository.name}`,
        URL:req.body.issue.url
    }
    if(challenge){
        if(userID==challenge.raisedBy) challenge.raisedUserActivity.push(obj)
        else if(userID==challenge.acceptedBy) challenge.acceptedUserActivity.push(obj)
    }
    res.status(201).json({
        status:"success"
    })
})

export default openIssue;