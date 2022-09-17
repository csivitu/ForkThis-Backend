import mongoose from 'mongoose'
import envHandler from './envHandler.js'


const URL = envHandler('NODE_ENV')==='dev' ? "mongodb://127.0.0.1:27017" : envHandler("DATABASE_URL").replace('<password>', envHandler("DATABASE_PASSWORD"))


const connectToDB = () => mongoose.connect(URL)
                            .then(() =>console.log("Connected to Database!"))

export default connectToDB
