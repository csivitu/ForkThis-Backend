import catchAsync from "../../managers/catchAsync.js";
import User from "../../models/userModel.js";
import Issue from "../../models/issueModel.js";

const reopenIssue=catchAsync(async(req, res, next)=>{
    await Issue.findOneAndUpdate({issueURL:req.body.issue.url},{
        isClosed:false
    })
    res.status(200).json({
        status:"success"
    })
})

export default reopenIssue;