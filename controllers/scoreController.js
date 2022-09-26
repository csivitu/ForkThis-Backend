import catchAsync from "../managers/catchAsync.js";
import User from "../models/userModel.js"
import { getAllDocs } from "../utils/HandlerFactory.js";

export const getLeaderboards= catchAsync(async (req, res, next)=>{

    const docs = await User.find().sort({score:-1})

    res.status(200).json({
        status: 'success',
        results: docs.length,
        requestedAt: req.requestedAt,
        data: docs,
    });
})

const tagChecker = (l1, l2)=>{
    const checker=false;
    for(var i=0; i<l1.length; i++){
        const val = l1[i];
        if (l2.contains(val)){
            checker= true;
            break;
        }
    }
    return checker;
}

export const setScore =async (issue, user, challenge)=>{
    const nowScore = user.score;
    if(issue.labels.includes('beginner')){
        user.score+=10;
        user.coins+=2;
    }
    else if(issue.labels.includes('easy')){
        user.score++;
        user.coins++
    }
    else if(issue.labels.includes('medium')){
        user.score++;
        user.coins++
    }
    else if(issue.labels.includes('hard')){
        user.score++;
        user.coins++
    }
    else if(issue.labels.includes('expert')){
        user.score++;
        user.coins++
    }
    
    if(tagChecker(issue.labels, challenge.labels)){
        if(challenge.raisedBy==user.id) challenge.raisedUserScore+=user.score-nowScore;
        else if(challenge.acceptedBy==user.id) challenge.acceptedUserScore+=user.score-nowScore;
    }

    await user.save()
    await challenge.save()
}