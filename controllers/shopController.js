import catchAsync from "../managers/catchAsync";
import Item from "../models/shopModels/itemModel";
import Purchase from "../models/shopModels/purchaseModel";
import { createDoc, getAllDocs, getAllDocsByUser, getDoc } from "../utils/HandlerFactory";

export const getItems = getAllDocs(Item)

export const getItem = getDoc(Item)

export const addItem = createDoc(Item)

export const buyItem = createDoc(Purchase)

export const getPurchase = getDoc(Purchase)

export const getUserPurchases = getAllDocsByUser(Purchase)