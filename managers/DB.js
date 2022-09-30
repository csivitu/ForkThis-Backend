import mongoose from 'mongoose'
import { rescheduleChallenges } from '../utils/rescheduleChallenges.js'
import envHandler from './envHandler.js'

const URL = envHandler("DATABASE_URL").replace('<password>', envHandler("DATABASE_PASSWORD"))

const connectToDB = () => mongoose.connect(URL)
                            .then(() =>{
                                console.log("Connected to Database!")
                                rescheduleChallenges(Date.now())
                            })

export default connectToDB
