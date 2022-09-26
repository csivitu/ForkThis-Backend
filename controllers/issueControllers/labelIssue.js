import catchAsync from "../../managers/catchAsync.js";
import Issue from "../../models/issueModel.js";

const labelIssue=catchAsync(async(req, res, next)=>{
    const gitLabels=req.body.issue.labels;
    const labels=[];
    gitLabels.forEach(el=>{labels.push(el.name)})
    await Issue.findOneAndUpdate({issueURL:req.body.issue.url})
    res.status(200).json({
        status:"success"
    })
})

export default labelIssue;