import catchAsync from "../../managers/catchAsync.js";
import User from "../../models/userModel.js";
import PR from "../../models/prModel.js";
import Issue from "../../models/issueModel.js";
import Challenge from "../../models/challengeModel.js";

const openPR=catchAsync(async(req, res, next)=>{
    const username=req.body.pull_request.user.login;
    const repoURL=req.body.pull_request.base.repo.url;
    const issueTag=req.body.pull_request.body.match(/#\d+/g)[0].match(/\d+/)[0]
    const issueURL=`${repoURL}/issues/${issueTag}`
    const user = await User.findOne({username:username});
    const issue= await Issue.findOne({issueURL:issueURL});
    await PR.create({
        user:user.id,
        issue:issue.id,
        prURL:req.body.pull_request.url
    })

    const challenge = await Challenge.findOne({$and:[{challengeStatus:'accepted'}, { $or: [ { raisedBy: req.user.id }, { acceptedBy: req.user.id } ] }]})
    const obj = {
        data:`Raised a new Pull Request in ${issue.repo}`,
        URL:req.body.pull_request.url
    }
    if(challenge){
        if(user.id==challenge.raisedBy) challenge.raisedUserActivity.push(obj)
        else if(user.id==challenge.acceptedBy) challenge.acceptedUserActivity.push(obj)
    }

    res.status(200).json({
        status:"success"
    })
})

export default openPR;