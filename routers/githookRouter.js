import express from 'express'
import { gitHookCheck } from '../Controllers/authController.js';
import { issueController, PRController } from '../controllers/githookController.js';

const githookRouter= express.Router()

githookRouter.post('/pullRequests', gitHookCheck, PRController);

githookRouter.post('/issue', gitHookCheck, issueController)

export default githookRouter;