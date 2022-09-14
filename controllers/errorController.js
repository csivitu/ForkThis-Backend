import AppError from "../managers/AppError.js";
import envHandler from "../managers/envHandler.js";

const CastErrorHandler= err=>{
    const message=`Invalid ${err.path}: ${err.value}.`
    return new AppError(message, 400)
}

const DuplicateErrorHandler= err=>{
    const [field, input]=[Object.keys(err.keyValue)[0], Object.values(err.keyValue)[0]]
    const message=`Duplicate ${field}: ${input}`
    return new AppError(message, 400)
}

const ValidationErrorHandler= err=>{
    const errors= Object.values(err.errors).map(el=>el.message)
    const message=`Invalid input: ${errors.join(', ')}`
    return new AppError(message, 400)
}

const JWTErrorHandler= (err, errName)=>{
    if (errName==="invalid") return new AppError("Invalid Token. Please Login Again", 401)
    else return new AppError("Token Expired. Please Login Again", 401)
}

const JoiErrorHandler= err=>{
    let message='';
    err.details.forEach((obj)=>{
        message+=`${obj.message} `
    })
    return new AppError(message, 400);
}

export const noURL=(err, req, res, next)=>{   
    err.statusCode= err.statusCode || 500;
    err.status= err.status || "error";
    if(envHandler("NODE_ENV")==='dev'){
        res.status(err.statusCode).json({
            status:err.status,
            error:err,
            message:err.message,
            stack:err.stack
    })
    } else if(envHandler("NODE_ENV")==='prod'){
        let error={...err};
        if(err.name==="CastError") error=CastErrorHandler(error)
        if(err.code===11000) error=DuplicateErrorHandler(error)
        if(err._message) if(err._message.match(/validation failed/)) error=ValidationErrorHandler(error)
        if(err.name==="JsonWebTokenError") error=JWTErrorHandler(error, "invalid")
        if(err.name==="TokenExpiredError") error=JWTErrorHandler(error, "expired")
        if(err.isJoi) error=JoiErrorHandler(error)

        if(error.isOperationError){
            res.status(error.statusCode).json({
                status:error.status,
                message:error.message || err.message
            })
        } else {
            console.log("Error: ", error);
            res.status(500).json({
                status:"error",
                message:"Something went Wrong!"
            })
        }
    }
}