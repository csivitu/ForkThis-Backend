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

    const docs = await Purchase.find({user:req.user.id}).sort({purchasedAt:-1}).populate('user')
    
    res.status(200).json({
        status: 'success',
        results: docs.length,
        requestedAt: req.requestedAt,
        data: docs,
    });
})