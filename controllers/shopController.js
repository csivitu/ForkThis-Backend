import catchAsync from "../managers/catchAsync.js";
import Item from "../models/shopModels/itemModel.js";
import Purchase from "../models/shopModels/purchaseModel.js";
import User from "../models/userModel.js";
import { createDoc, getAllDocs, getAllDocsByUser, getDoc } from "../utils/HandlerFactory.js";

export const getItems = getAllDocs(Item)

export const getItem = getDoc(Item)

export const addItem = createDoc(Item)

export const buyItem = createDoc(Purchase)

export const getPurchase = getDoc(Purchase)

export const getUserPurchases = catchAsync(async (req, res, next)=>{
    console.log(req.user)
    const user = await User.findOne({id:req.user.id})
    if(!user) return next(new AppError("No user of this username found", 401))
    const userID=user.id;

    const docs = await Purchase.find({user:userID}).sort({purchasedAt:-1})
    // console.log(docs)

    res.status(200).json({
        status: 'success',
        results: docs.length,
        requestedAt: req.requestedAt,
        data: docs,
    });
})