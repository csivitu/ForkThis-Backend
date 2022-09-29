import express from 'express'
import { protect } from '../controllers/authController.js'
import { addItem, buyItem, getItem, getItems, getPurchase, getUserPurchases } from '../controllers/shopController.js'
import { joiItemValidator } from '../validators/joiValidators/itemValidator.js'
import { joiPurchaseValidator } from '../validators/joiValidators/purchaseValidator.js'

const shopRouter = express.Router()

shopRouter.post('/item', protect, joiItemValidator, addItem)

shopRouter.get('/items', protect, getItems)

shopRouter.get('/item/:id', protect, getItem)

shopRouter.post('/purchase', protect, joiPurchaseValidator, buyItem)

shopRouter.get('/purchases',(req, res, next)=>{console.log(req.headers.authorization)}, protect, getUserPurchases)

shopRouter.get('/purchase/:id', protect, getPurchase)

export default shopRouter;