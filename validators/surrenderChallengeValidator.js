import AppError from "../managers/AppError.js";

const surrenderChallengeValidator = (req, res, next) =>{
    const challenge=req.challenge;
    if(challenge.raisedBy!=req.user.id && challenge.acceptedBy!=req.user.id) return next(new AppError("Invalid request.", 400))
    if(challenge.endsAt<Date.now()) return next(new AppError("Challenge has already ended", 400))
    next()
}

export default surrenderChallengeValidator;