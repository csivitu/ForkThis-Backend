import express from 'express'
import { gitHookCheck } from '../Controllers/authController.js';
import { acceptPullRequest, addPullRequest, gitHookTester, raiseIssue } from '../controllers/githookController.js';

const githookRouter= express.Router()

githookRouter.post('/', gitHookCheck, gitHookTester)

githookRouter.post('/addPR', gitHookCheck, addPullRequest);

githookRouter.post('/acceptPR', gitHookCheck, acceptPullRequest)

githookRouter.post('/raiseIssue', gitHookCheck, raiseIssue)

export default githookRouter;