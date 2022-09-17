import User from "../models/userModel.js"
import { getAllDocs } from "../utils/HandlerFactory.js";

export const getLeaderboards= getAllDocs(User)

export const setScore =async (issue, user)=>{
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
    await user.save()
}