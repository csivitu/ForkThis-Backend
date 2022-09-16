import catchAsync from "../managers/catchAsync.js";
import Item from "../models/shopModels/itemModel.js";
import Purchase from "../models/shopModels/purchaseModel.js";
import { createDoc, getAllDocs, getAllDocsByUser, getDoc } from "../utils/HandlerFactory.js";

export const getItems = getAllDocs(Item)

export const getItem = getDoc(Item)

export const addItem = createDoc(Item)

export const buyItem = createDoc(Purchase)

export const getPurchase = getDoc(Purchase)

export const getUserPurchases = getAllDocsByUser(Purchase)