import express from 'express'
import { gitHookCheck } from '../Controllers/authController.js';
import { tester } from '../controllers/githookController.js';

const githookRouter= express.Router()

githookRouter.post('/', gitHookCheck, tester)

export default githookRouter;