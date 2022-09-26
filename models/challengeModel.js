import mongoose from "mongoose";
import { scheduleJob } from "node-schedule";
import moment from 'moment'
import User from "./userModel.js";
import { scheduleChallenge } from "../utils/scheduleChallenge.js";

const challengeSchema = mongoose.Schema({
    raisedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    acceptedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    challengeStatus:{
        type:String,
        enum:['raised','accepted','rejected','ended'],
        default:'raised'
    },
    tags:[String],
    startsAt:Date,
    endsAt:Date,
    accceptedAt:Date,
    pointsBet:Number,
    raisedUserScore:{
        type:Number,
        default:0
    },
    acceptedUserScore:{
        type:Number,
        default:0
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

challengeSchema.index({startsAt:-1})

// challengeSchema.pre(/^find/,function(next){
//     this.populate('raisedBy').populate('acceptedBy');
//     next()
// })

challengeSchema.post("save", async function(doc){
    scheduleChallenge(doc)
    // const arr=moment(new Date(this.endsAt)).format('MMMM Do YYYY, h:mm:ss a').split(' ')
    // const month=new Date(Date.parse(arr[0] +" 1, 2012")).getMonth()+1
    // const date=arr[1].substring(0,2);
    // const time_arr=arr[3].split(':');
    // var hr=time_arr[0];
    // const min=time_arr[1];
    // const sec=time_arr[2];
    // if(arr[4]=='pm') hr=(Number(hr)+12).toString();

    // scheduleJob(`${sec} ${min} ${hr} ${date} ${month} *`,async function(){
    //     const challenge = await Challenge.findById(doc.id)
    //     if(challenge && challenge.accceptedBy){
    //         const raisedUser = await User.findById(challenge.raisedBy);
    //         const acceptedUser = await User.findById(challenge.acceptedBy);
    //         if(challenge.raisedUserScore>challenge.acceptedUserScore){
    //             raisedUser.score+=challenge.pointsBet
    //             acceptedUser.score-=challenge.pointsBet
    //         }
    //         else if(challenge.raisedUserScore<challenge.acceptedUserScore){
    //             raisedUser.score-=challenge.pointsBet
    //             acceptedUser.score+=challenge.pointsBet
    //         }
    //         raisedUser.save();
    //         acceptedUser.save();
    //         challenge.challengeStatus='ended';
    //         challenge.save()
    //     }
    // })
})

const Challenge = mongoose.model('Challenge', challengeSchema);

export default Challenge;
