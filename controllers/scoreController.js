import catchAsync from "../managers/catchAsync.js";
import User from "../models/userModel.js"
import { getAllDocs } from "../utils/HandlerFactory.js";

export const getLeaderboards= getAllDocs(User)

export const setScore = (PR, user)=>{
    if(PR.difficulty=='easy'){
        user.score++;
        user.coins++
    }
    else if (PR.difficulty=='easy'){
        user.score++;
        user.coins++;
    }
    else{
        user.score++;
        user.coins++;
    }
    return user;
}