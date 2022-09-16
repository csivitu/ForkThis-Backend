import mongoose from "mongoose";

const IssueSchema = new mongoose.Schema({
    repo:String,
    repo_url:String,
    raisedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    title:String,
    label:{
        enum:{
            type:String,
            values:['','','']
        }
    },
    isSolved:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
},{
    toJSON : {virtuals:true},
    toObject : {virtuals:true} 
})

IssueSchema.index({createdAt : -1})

const Issue = mongoose.model("Issue", IssueSchema);

export default Issue;