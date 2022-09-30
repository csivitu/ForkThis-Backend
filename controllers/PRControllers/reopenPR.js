import catchAsync from "../../managers/catchAsync.js";
import User from "../../models/userModel.js";
import PR from "../../models/prModel.js";
import Issue from "../../models/issueModel.js";

const reopenPR=catchAsync(async(req, res, next)=>{
    const username=req.body.pull_request.user.login;
    const repoURL=req.body.pull_request.base.repo.url;
    const issueTag=req.body.pull_request.body.match(/#\d+/g)[0].match(/\d+/)[0]
    const issueURL=`${repoURL}/issues/${issueTag}`
    const user = await User.findOne({username:username});
    const issue= await Issue.findOne({issueURL:issueURL});
    const pr = await PR.findOneAndUpdate({user:user.id, issue:issue.id},{
        isClosed:false
    })
    res.status(200).json({
        status:"success"
    })
})

export default reopenPR;