import express from 'express'
import { protect } from '../controllers/authController.js';
import { acceptChallenge, deleteChallenge, getActiveChallenges, getChallenge, getChallenges, getClosedChallenges, getRaisedChallenges, getReqChallenge, raiseChallenge } from '../controllers/challengeController.js';
import { joiChallengeValidator } from '../validators/joiValidators/challengeValidator.js';
import acceptChallengeValidator from '../validators/acceptChallengeValidator.js';

const challengeRouter = express.Router();

challengeRouter.get('/', getChallenges)

challengeRouter.get('/raised', protect, getRaisedChallenges);
challengeRouter.get('/active', protect, getActiveChallenges);
challengeRouter.get('/closed', protect, getClosedChallenges)

challengeRouter.post('/raise', protect, joiChallengeValidator, raiseChallenge);

challengeRouter.post('/accept/:id', protect, getReqChallenge, acceptChallengeValidator, acceptChallenge);

challengeRouter.get('/:id', protect, getChallenge)
challengeRouter.delete('/:id', protect, deleteChallenge)

export default challengeRouter;