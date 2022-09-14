import mongoose from 'mongoose'
import envHandler from './envHandler.js'

const connectToDB = () => mongoose.connect(envHandler("DATABASE_URL").replace('<password>', envHandler("DATABASE_PASSWORD")))
                            .then(() =>console.log("Connected to Database!"))

export default connectToDB
