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
        isDelivered:Boolean,
        deliveredAt:Date
    },
    purchasedAt:{
        type:Date,
        default:Date.now()
    }
})

const Purchase = mongoose.model("Purchase", purchaseSchema);

export default Purchase;