import mongoose from "mongoose";

const IssueSchema = new mongoose.Schema({
    repo:String,
    repoURL:String,
    raisedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    title:String,
    issueURL:String,
    labels:[String],
    difficulty:{
        type:String,
        enum:['beginner','easy','medium','hard','expert']
    },
    isClosed:{
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

// IssueSchema.pre(/^find/,function(next){
//     this.populate('raisedBy');
//     next()
// })

const Issue = mongoose.model("Issue", IssueSchema);

export default Issue;