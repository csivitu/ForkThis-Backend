import mongoose from "mongoose";
import Item from "./itemModel.js";
import User from "../userModel.js"

const purchaseSchema = mongoose.Schema({
    item:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Item'
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    count:Number,
    totalCoins:Number,
    delivery:{
        deliverTo:{
            addressLine1:String,
            addressLine2:String,
            addressLine3:String,
        },
        isDelivered:{
            type:Boolean,
            default:false
        },
        deliveredAt:Date
    },
    purchasedAt:{
        type:Date,
        default:Date.now()
    }
})

purchaseSchema.pre(/^find/,function(next){
    this.populate('item');
    next()
})

purchaseSchema.pre("save", async function(next){
    this.purchasedAt=Date.now()
    next()
})

purchaseSchema.post("save", async function(doc){
    const user= await User.findById(doc.user)
    const item = await Item.findById(doc.item)
    item.countInStock-=doc.count;
    user.coins-=doc.totalCoins;
    item.save()
    user.save()
})

purchaseSchema.index({purchasedAt:-1})

const Purchase = mongoose.model("Purchase", purchaseSchema);

export default Purchase;