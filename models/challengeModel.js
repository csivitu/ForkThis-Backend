import mongoose from "mongoose";
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
    difficulty:{
        type:String,
        lowercase:true,
        enum:['beginner','easy','medium','hard','expert']
    },
    startsAt:Date,
    endsAt:Date,
    accceptedAt:Date,
    coinsBet:Number,
    raisedUserScore:{
        type:Number,
        default:0
    },
    raisedUserActivity:[{
        data:String,
        URL:String
    }],
    acceptedUserScore:{
        type:Number,
        default:0
    },
    acceptedUserActivity:[{
        data:String,
        URL:String
    }],
    createdAt:{
        type:Date,
        default:Date.now().toString()
    }
})

challengeSchema.index({startsAt:-1})

challengeSchema.post("save", async function(doc){
    scheduleChallenge(doc)
})

const Challenge = mongoose.model('Challenge', challengeSchema);

export default Challenge;
