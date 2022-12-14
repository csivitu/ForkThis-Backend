import catchAsync from "../../managers/catchAsync.js";
import User from "../../models/userModel.js";
import PR from "../../models/prModel.js";
import Issue from "../../models/issueModel.js";
import { setScore } from "../scoreController.js";
import Challenge from "../../models/challengeModel.js";

const mergePR=catchAsync(async(req, res, next)=>{
    const username=req.body.pull_request.user.login;
    const repoURL=req.body.pull_request.base.repo.url;
    const issueTag=req.body.pull_request.body.match(/#\d+/g)[0].match(/\d+/)[0]
    const issueURL=`${repoURL}/issues/${issueTag}`
    const user = await User.findOne({username:username});
    const issue= await Issue.findOne({issueURL:issueURL});
    const prURL= req.body.pull_request.url
    const pr = await PR.findOneAndUpdate({prURL:prURL},{
        isClosed:true,
        isMerged:true
    })
    // const pr = await PR.findOneAndUpdate({user:user.id, issue:issue.id},{
    //     isClosed:true,
    //     isMerged:true
    // })
    const challenge = await Challenge.findOne({$and:[{challengeStatus:'accepted'}, { $or: [ { raisedBy: req.user.id }, { acceptedBy: req.user.id } ] }]})
    setScore(issue, user, challenge)
    res.status(200).json({
        status:"success"
    })
})

export default mergePR;