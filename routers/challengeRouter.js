import express from 'express'
import { protect } from '../controllers/authController.js';
import { acceptChallenge, deleteChallenge, getActiveChallenges, getChallenge, getChallenges, getClosedChallenges, getRaisedChallenges, getReqChallenge, raiseChallenge, surrenderChallenge } from '../controllers/challengeController.js';
import { joiChallengeValidator } from '../validators/joiValidators/challengeValidator.js';
import acceptChallengeValidator from '../validators/acceptChallengeValidator.js';
import surrenderChallengeValidator from '../validators/surrenderChallengeValidator.js';

const challengeRouter = express.Router();

challengeRouter.get('/', getChallenges)

challengeRouter.get('/raised', protect, getRaisedChallenges);
challengeRouter.get('/active', protect, getActiveChallenges);
challengeRouter.get('/closed', protect, getClosedChallenges)

challengeRouter.post('/raise', protect, joiChallengeValidator, raiseChallenge);

challengeRouter.post('/accept/:id', protect, getReqChallenge, acceptChallengeValidator, acceptChallenge);
challengeRouter.post('/surrender/:id', protect, getReqChallenge, surrenderChallengeValidator, surrenderChallenge);

challengeRouter.route('/:id')
                .get(protect, getChallenge)
                .delete(protect, getReqChallenge, deleteChallenge)

export default challengeRouter;