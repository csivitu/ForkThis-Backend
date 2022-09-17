import catchAsync from "../../managers/catchAsync.js";
import User from "../../models/userModel.js";
import Issue from "../../models/issueModel.js";

const closeIssue=catchAsync(async(req, res, next)=>{
    await Issue.findOneAndUpdate({issueURL:req.body.issue.url},{
        isClosed:true
    })
    res.status(200).json({
        status:"success"
    })
})

export default closeIssue;