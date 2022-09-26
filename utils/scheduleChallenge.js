import { scheduleJob } from "node-schedule";
import moment from "moment";

export const scheduleChallenge=(challenge) => {
    const arr=moment(new Date(challenge.endsAt)).format('MMMM Do YYYY, h:mm:ss a').split(' ')
    const month=new Date(Date.parse(arr[0] +" 1, 2012")).getMonth()+1
    const date=arr[1].substring(0,2);
    const time_arr=arr[3].split(':');
    var hr=time_arr[0];
    const min=time_arr[1];
    const sec=time_arr[2];
    if(arr[4]=='pm') hr=(Number(hr)+12).toString();
    scheduleJob(`${sec} ${min} ${hr} ${date} ${month} *`,async function(){
        if(challenge && challenge.accceptedBy){
            const raisedUser = await User.findById(challenge.raisedBy);
            const acceptedUser = await User.findById(challenge.acceptedBy);
            if(challenge.raisedUserScore>challenge.acceptedUserScore){
                raisedUser.score+=challenge.pointsBet
                acceptedUser.score-=challenge.pointsBet
            }
            else if(challenge.raisedUserScore<challenge.acceptedUserScore){
                raisedUser.score-=challenge.pointsBet
                acceptedUser.score+=challenge.pointsBet
            }
            raisedUser.save();
            acceptedUser.save();
            challenge.challengeStatus='ended';
            challenge.save()
            }
    })
}