import express from 'express'
import { protect } from '../controllers/authController.js';
import { acceptChallenge, acceptUserChallenge, deleteChallenge, getChallenge, raiseChallenge, raiseUserChallenge, rejectUserChallenge } from '../controllers/challengeController.js';
import { joiChallengeValidator, joiUserChallengeValidator } from '../utils/joiValidators/challengeValidator.js';

const challengeRouter = express.Router();

challengeRouter.post('/raise', protect, joiChallengeValidator, raiseChallenge);

challengeRouter.post('/raiseUser', protect, joiUserChallengeValidator, raiseUserChallenge);

challengeRouter.post('/accept/:id', protect, getChallenge, acceptChallenge);

challengeRouter.post('/acceptUser/:id', protect, getChallenge, acceptUserChallenge);

challengeRouter.post('/rejectUser/:id', protect, getChallenge, rejectUserChallenge);

challengeRouter.delete('/:id', protect, deleteChallenge)

export default challengeRouter;