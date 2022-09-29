import express from "express";
import { protect } from "../Controllers/authController.js";
import { getLeaderboards } from "../controllers/scoreController.js";
import { getUser, getRecents, getDashboard, getMe, getRepoIssues, setGitUsername } from "../Controllers/userController.js";
import { joiUserCreateValidator } from "../validators/joiValidators/joiUserValidator.js";
import imageUploadParserer from "../utils/parserers/imageUploadParserer.js";
import resizePic from "../utils/resizePic.js";

const userRouter= express.Router()

userRouter.post('/gitUsername',protect, setGitUsername)

userRouter.get('/leaderboards',  protect, getLeaderboards) 

userRouter.get('/recents', protect, getRecents)

userRouter.get('/dashboard', protect, getDashboard)

userRouter.get('/me', protect, getMe)

userRouter.get('/repoIssues/:repo', protect, getRepoIssues)

userRouter.get('/:userID', protect, getUser)

export default userRouter