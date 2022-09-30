import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import AppError from "../managers/AppError.js";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,
    },
    profilePic:{
        type:String,
        // default:
    }, 
    phoneNo:Number,
    username:{
        type:String,
        unique:true,
        required:true
    },
    tags:[String],
    score:{
        type:Number,
        default:0,
        validate:{
            validator: function(el){
                return el>=0
            }
        }
    },
    coins:{
        type:Number,
        default:0,
        validate:{
            validator: function(el){
                return el>=0
            }
        }
    },
    isGithubUsername:{
        type:Boolean,
        default:false
    }
    // password:{
    //     type:String,
    //     required:true,
    //     minlength:8,
    //     select:false
    // },
    // confirmPassword:String,
    // passwordChangedAt:{
    //     type:Date,
    //     default:Date.now()
    // }
},{
    toJSON : {virtuals:true},
    toObject : {virtuals:true} 
});

userSchema.index({score : -1})

userSchema.virtual('PRs',{
    ref:'PR',
    foreignField:'user',
    localField:'_id'
})

userSchema.virtual('issuesRaised',{
    ref:'Issue',
    foreignField:'raisedBy',
    localField:'_id'
})

userSchema.virtual('noOfPRs').get(function(){
    if(this.PRs) return this.PRs.length;
    else return 0
})

userSchema.virtual('noOfIssuesRaised').get(function(){
    if(this.issuesRaised) return this.issuesRaised.length;
    else return 0
})

userSchema.virtual('noOfIssuesSolved').get(function(){
    const count=0;
    if(this.PRS) this.PRs.forEach(el=>{
        if(el.isMerged) count++;
    })
    return count;
})

userSchema.pre("save", async function(next){
    if(!this.isModified('password'))  return next()
    if(this.password!=this.confirmPassword) return next(new AppError("Passwords do not match", 400))
    this.password= await bcrypt.hash(this.password, 12)
    this.confirmPassword=undefined
    next()
})

userSchema.methods.correctPassword = async function (inPass, userPass){
    return await bcrypt.compare(inPass, userPass)
};

userSchema.methods.changedPasswordAfter =  function (JWTTimestrap){
    const changedTimestrap=parseInt(this.passwordChangedAt.getTime() / 1000, 10)
    return JWTTimestrap<changedTimestrap
}

const User = mongoose.model("User", userSchema);

export default User;