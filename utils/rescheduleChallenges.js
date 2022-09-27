import { scheduleChallenge } from "./scheduleChallenge.js";
import Challenge from "../models/challengeModel.js";

function filter(arr, time){
    const newArr=[];
    arr.forEach(el=>{
        if(el.challengeStatus=='raised' || el.challengeStatus=='accepted') if(el.endsAt>time) newArr.push(el)
    })
    return newArr;
}

export const rescheduleChallenges =async time=>{
    const challenges= await Challenge.find()
    const filteredChallenges=filter(challenges, time);
    filteredChallenges.forEach(el=>scheduleChallenge(el))
}