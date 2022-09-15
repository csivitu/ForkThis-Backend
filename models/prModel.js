import mongoose from "mongoose";

const PRSchema = new mongoose.Schema({
    PRType:{
        enum:{
            type:String,
            values:['raised', 'merged']
        }
    },
    repo:String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    issue:String,
    difficulty:{
        enum:{
            type:String,
            values:['','','']
        }
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
},{
    toJSON : {virtuals:true},
    toObject : {virtuals:true} 
})

PRSchema.index({createdAt : -1})

const PR = mongoose.models.PR || mongoose.model("PR", PRSchema);

export default PR;