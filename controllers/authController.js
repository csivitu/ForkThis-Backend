import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import AppError from "../managers/AppError.js";
import catchAsync from "../managers/catchAsync.js";
import envHandler from "../managers/envHandler.js";
import { createHmac } from "crypto";

export const createSendToken = (user, statusCode, res)=>{
    const token=jwt.sign({ id:user._id }, envHandler("JWT_KEY"), {expiresIn: envHandler("JWT_TIME")*24*60})
    user.password=undefined
    
    const cookieSettings={
        expires: new Date(
            Date.now() + envHandler("JWT_TIME")*24*60*60*1000
        ),
        httpOnly:true
    };

    if(envHandler("NODE_ENV")==="prod") cookieSettings.secure=true;

    res.cookie('jwt', token, cookieSettings)

    res.status(statusCode).json({
        status:"success",
        token:token,
        data:{
            user:user
        }
    })
}

export const signup = catchAsync(async (req,res, next)=>{
        
        const newUser= await User.create(req.body)
        createSendToken(newUser, 201, res)
})

export const login = catchAsync(async (req,res, next)=>{
        const { username, password } = req.body;

        if(!username || !password) return next(new AppError("Email or Password doesn't exists", 400));

        const user= await User.findOne({username:username}).select("+password")

        if(!user || !await user.correctPassword(password, user.password)) throw new AppError("Incorrect Email or Password", 400);

        createSendToken(user, 200, res)
})

// export const protect = catchAsync(async (req, res, next)=>{
//     let token;

//     if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))token=req.headers.authorization.split(' ')[1]

//     if(!token) return next(new AppError("You are not Logged in. Please Login to continue", 401))

//     const decoded= await promisify(jwt.verify)(token, envHandler("JWT_KEY"))

//     // edits for accounts integration

//     const user= await User.findById(decoded.id)

//     if(req.params.userID && decoded.id!=req.params.userID) return next(new AppError("Please Login in as the Modifying User.", 401))

//     if(!user) return next(new AppError("User of this token no longer exists", 401))

//     if(user.changedPasswordAfter(decoded.iat)) return next(new AppError("Password was recently changed. Please Login again", 401))

//     req.user=user;
//     next()
// })

export const protect = catchAsync(async (req, res, next)=>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))token=req.headers.authorization.split(' ')[1]
    
    if(!token) return next(new AppError("You are not Logged in. Please Login to continue", 401))

    const decoded= await promisify(jwt.verify)(token, envHandler("CSI_TOKEN"))

    const user= await User.findOne({username:decoded.username})

    if(!user){
        const name=decoded.name
        const email=decoded.email
        const phoneNo=decoded.mobile
        const username=decoded.username
        if(name && email && phoneNo && username){
            try{
                const newUser = User.create({
                    name:name,
                    email:email,
                    phoneNo:phoneNo,
                    username:username
                })
                req.user=newUser
                console.log("new user created")
            }catch(err){
                console.log(err)
            }
        }
        else return next(new AppError("Invalid token.", 401))
    }

    if(req.params.username && decoded.username!=req.params.username) return next(new AppError("Please Login in as the Modifying User.", 401))

    if(!user && !newUser) return next(new AppError("User of this token does not exists", 401))

    if(user) req.user=user;
    next()
})

export const logout = catchAsync(async (req, res, next)=>{
    res.cookie('token', 'loggedout', {
        expires: new Date(Date.now()+ 1*1000),
        httpOnly: true
    });
    res.status(200).json({
        status:"success",
        requestedAt: req.requestedAt,
        message :"User Loggout Out"
    })
})

export const gitHookCheck = catchAsync(async(req, res, next)=>{
    const hash = createHmac('sha256', process.env.GITHOOK_KEY)
                .update(JSON.stringify(req.body))
                .digest('hex');
    if(("sha256="+hash).localeCompare(req.headers['x-hub-signature-256'])!=0)
    return next(new AppError("GitHook Verification Failed"))
    next()
})