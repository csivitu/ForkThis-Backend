import express from "express";
import morgan from "morgan"
import path from 'path'
import AppError from "./managers/AppError.js";
import { noURL } from "./controllers/ErrorController.js";
import userRouter from "./routers/userRouter.js";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import cors from 'cors'
import connectToDB from './managers/DB.js';
import {uncaughtExceptionManager, unhandledRejectionManager} from './managers/baseErrorManager.js';
import githookRouter from "./routers/githookRouter.js";
import challengeRouter from "./routers/challengeRouter.js";
import shopRouter from "./routers/shopRouter.js";
import envHandler from "./managers/envHandler.js";

uncaughtExceptionManager 

const __dirname=path.resolve() 

const app=express()

app.use(express.json()) 

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(cors())

app.use(helmet())
app.use(ExpressMongoSanitize())

app.use(express.static(path.join(__dirname, 'public')))

if(envHandler('NODE_ENV')=='dev') app.use(morgan("dev"))

connectToDB()

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${process.env.PORT}`);
});

unhandledRejectionManager

app.use((req,res,next)=>{
    req.requestedAt=new Date().toISOString();
    next()
})

app.use("/users", userRouter)
app.use("/githubPayload", githookRouter)
app.use("/challenge", challengeRouter)
app.use("/shop", shopRouter)

app.all("*", (req, res, next)=>{
    next(new AppError(`Cannot find ${req.originalUrl}`, 404))
}) 

app.use(noURL)

export default app 