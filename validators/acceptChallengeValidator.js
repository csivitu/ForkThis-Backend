import AppError from "../managers/AppError.js";

const acceptChallengeValidator = (req, res, next) =>{
    const challenge=req.challenge;
    if(challenge.startsAt<Date.now()) return next(new AppError("Challenge has already started.", 400));
    if(challenge.acceptedBy) return next(new AppError("Challenge is already accepted.", 400));
    if(challenge.raisedBy==req.user.id) return next(new AppError("Cannot accepted this challenge.", 400))
    if(challenge.coinsBet>req.user.coins) return next(new AppError("Do not have enough coins to accept this challenge.", 400))
    next()
}

export default acceptChallengeValidator;