import express from 'express'
import { gitHookCheck } from '../controllers/authController.js';
import { issueController, oauthHandler, PRController } from '../controllers/githookController.js';

const githookRouter= express.Router()

githookRouter.get('/githubAccessToken', oauthHandler)

githookRouter.post('/pullRequests', gitHookCheck, PRController);

githookRouter.post('/issue', gitHookCheck, issueController)

export default githookRouter;