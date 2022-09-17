import mongoose from "mongoose";

const PRSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    issue:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Issue'
    },
    isClosed:{
        type:Boolean,
        default:false
    },
    isMerged:{
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

PRSchema.index({createdAt : -1})

const PR = mongoose.model("PR", PRSchema);

export default PR;