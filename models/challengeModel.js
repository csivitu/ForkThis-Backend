import mongoose from "mongoose";

// idea to list all the challenges and anyone can view and accept it

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
        enum:{
            type:String,
            values:['raised','accepted','rejected','ended']
        }
    },
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
})

const Challenge = mongoose.model('Challenge', challengeSchema);

export default Challenge;