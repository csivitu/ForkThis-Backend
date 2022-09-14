import express from "express";
import { signup, login, protect } from "../Controllers/authController.js";
import { getAllUsers, UpdatePassword, getUser, updateUser, deleteUser, forgotPassword, resetPassword } from "../Controllers/userController.js";
import { joiUserCreateValidator, joiUserUpdateValidator } from "../utils/joiValidators/joiUserValidator.js";
import imageUploadParserer from "../utils/parserers/imageUploadParserer.js";
import resizePic from "../utils/resizePic.js";

const userRouter= express.Router()

userRouter.post('/signup', imageUploadParserer, joiUserCreateValidator, resizePic, signup)
userRouter.post('/login',login)

userRouter.patch('/updatePassword', protect, UpdatePassword)
userRouter.post('/forgotPassword', forgotPassword)
userRouter.post('/resetPassword', resetPassword)

userRouter.get('/', getAllUsers)
userRouter.route('/:id')
.get(protect, getUser)
.patch(protect, imageUploadParserer, joiUserUpdateValidator, resizePic, updateUser)
.delete(protect, deleteUser)

export default userRouter