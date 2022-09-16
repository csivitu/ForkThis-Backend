import mongoose from 'mongoose'
import envHandler from './envHandler.js'

var URL;

if(envHandler('NODE_ENV')=='dev') URL=envHandler('DEV_DATABASE_URL')
else URL=envHandler("DATABASE_URL").replace('<password>', envHandler("DATABASE_PASSWORD"))

const connectToDB = () => mongoose.connect(URL)
                            .then(() =>console.log("Connected to Database!"))

export default connectToDB
