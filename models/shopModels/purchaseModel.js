import mongoose from "mongoose";

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

const Purchase = mongoose.model("Purchase", purchaseSchema);

export default Purchase;