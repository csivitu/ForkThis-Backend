import express from 'express'
import { protect } from '../controllers/authController.js';
import { acceptChallenge, deleteChallenge, getActiveChallenges, getChallenge, getChallenges, getClosedChallenges, getRaisedChallenges, raiseChallenge } from '../controllers/challengeController.js';
import { joiChallengeValidator } from '../utils/joiValidators/challengeValidator.js';

const challengeRouter = express.Router();

challengeRouter.get('/', getChallenges)

challengeRouter.get('/raised', protect, getRaisedChallenges);
challengeRouter.get('/active', protect, getActiveChallenges);
challengeRouter.get('/closed', protect, getClosedChallenges)

challengeRouter.post('/raise', protect, joiChallengeValidator, raiseChallenge);

challengeRouter.post('/accept/:id', protect, getChallenge, acceptChallenge);

challengeRouter.delete('/:id', protect, deleteChallenge)

export default challengeRouter;