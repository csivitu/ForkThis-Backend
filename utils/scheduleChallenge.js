import { scheduleJob } from "node-schedule";
import moment from "moment";
import Challenge from "../models/challengeModel.js";
import User from "../models/userModel.js";

export const scheduleChallenge=(challenge) => {
    const arr=moment(new Date(challenge.endsAt)).format('MMMM Do YYYY, h:mm:ss a').split(' ')
    const month=new Date(Date.parse(arr[0] +" 1, 2012")).getMonth()+1
    const date=arr[1].substring(0,2);
    const time_arr=arr[3].split(':');
    var hr=time_arr[0];
    const min=time_arr[1];
    const sec=time_arr[2];
    console.log(month, date, hr, min, sec)
    if(arr[4]=='pm') hr=(Number(hr)+12).toString();
    scheduleJob(`${sec} ${min} ${hr} ${date} ${month} *`,async function(){
        const nowChallenge = await Challenge.findById(challenge.id)
        console.log("Scheduler running")
        if(nowChallenge && nowChallenge.acceptedBy){
            const raisedUser = await User.findById(nowChallenge.raisedBy);
            const acceptedUser = await User.findById(nowChallenge.acceptedBy);
            if(nowChallenge.raisedUserScore>nowChallenge.acceptedUserScore){
                raisedUser.coins+=nowChallenge.coinsBet
                acceptedUser.coins-=nowChallenge.coinsBet
            }
            else if(nowChallenge.raisedUserScore<nowChallenge.acceptedUserScore){
                raisedUser.coins-=nowChallenge.coinsBet
                acceptedUser.coins+=nowChallenge.coinsBet
            }
            raisedUser.save();
            acceptedUser.save();
            nowChallenge.challengeStatus='ended';
            nowChallenge.save()
        }
        if(nowChallenge && !nowChallenge.acceptedBy) await nowChallenge.delete()
    })
}