import AppError from "../managers/AppError.js";

const acceptChallengeValidator = (req, res, next) =>{
    const challenge=req.challenge;
    if(challenge.startsAt<Date.now()) return next(new AppError("Challenge has already started.", 400));
    if(challenge.acceptedBy) return next(new AppError("Challenge has already accepted.", 400));
    if(challenge.raisedBy==req.user.id) return next(new AppError("Cannot accepted this challenge.", 400))
    next()
}

export default acceptChallengeValidator;