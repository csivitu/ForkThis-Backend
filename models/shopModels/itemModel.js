import mongoose from "mongoose";

const itemSchema = mongoose.Schema({
    name:String,
    description:String,
    countInStock:Number,
    coins:Number
})

const Item = mongoose.model('Item', itemSchema);

export default Item;