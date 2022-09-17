import catchAsync from "../../managers/catchAsync.js";
import User from "../../models/userModel.js";
import Issue from "../../models/issueModel.js";

const openIssue=catchAsync(async(req, res, next)=>{
    const username=req.body.issue.user.login;
    const user = await User.findOne({username:username});
    const userID=user.id;
    const gitLabels=req.body.issue.labels;
    const labels=[];
    gitLabels.forEach(el=>{labels.push(el.name)})
    await Issue.create({
        repoURL: req.body.issue.repository_url,
        repo:req.body.repository.name,
        issueURL:req.body.issue.url,
        title:req.body.issue.title,
        raisedBy:userID,
        labels:labels
    })
    res.status(200).json({
        status:"success"
    })
})

export default openIssue;