import express from 'express'
import { protect } from '../controllers/authController.js'
import { addItem, buyItem, getItem, getItems, getPurchase, getUserPurchases } from '../controllers/shopController.js'
import { joiItemValidator } from '../validators/joiValidators/itemValidator.js'
import { joiPurchaseValidator } from '../validators/joiValidators/purchaseValidator.js'

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