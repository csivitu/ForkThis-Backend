import express from 'express'
import { protect } from '../controllers/authController.js'
import { addItem, buyItem, getItem, getItems, getPurchase, getUserPurchases } from '../controllers/shopController'
import { joiItemValidator } from '../utils/joiValidators/itemValidator'
import { joiPurchaseValidator } from '../utils/joiValidators/purchaseValidator'

const shopRouter = express.Router()

shopRouter.route('/item')
    .get(protect, getItem)
    .post(protect, joiItemValidator, addItem)

shopRouter.get('/items', protect, getItems)

shopRouter.route('/purchase/:id')
    .get(protect, getPurchase)
    .post(protect, joiPurchaseValidator, buyItem)

shopRouter.route('/purchases', protect, getUserPurchases)

export default shopRouter;