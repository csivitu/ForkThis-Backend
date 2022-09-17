import express from 'express'
import { gitHookCheck } from '../Controllers/authController.js';
import { gitHookTester, issueController, PRController } from '../controllers/githookController.js';

const githookRouter= express.Router()

githookRouter.post('/', gitHookCheck, gitHookTester)

githookRouter.post('/pullRequests', gitHookCheck, PRController);

githookRouter.post('/issue', gitHookCheck, issueController)

export default githookRouter;