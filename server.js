import dotenv from  'dotenv'
import express from 'express'
import cookieParser from 'cookie-parser'
import {connectDB} from './config/db.js'
import authRouter from './api/routes/auth.route.js'
import feedbackRouter from './api/routes/feedback.route.js'
import userRouter from './api/routes/user.route.js'
import corsMiddleware from './api/middleware/cors.js'
import { errorHandler } from './api/middleware/errorHandler.js'

//environment variables
dotenv.config()
//connecting to Database
connectDB()

const app= express()
const PORT = process.env.PORT || 5000

//middleware
app.use(express.json())
app.use(corsMiddleware)
app.use(cookieParser())
 

//routes
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/feedbacks', feedbackRouter)
app.use('/api/v1/user', userRouter)


//error handler
app.use(errorHandler)


//running the server
const server = app.listen(PORT, ()=>{
   console.log(`listening on port ${PORT}`)
})


//handling unhandled errors
process.on('unhandledRejection',(err, promise)=>{
   console.error(`Logged Error: ${err}`)
   server.close(()=>process.exit(1))
})
process.on('uncaughtException', (err)=>{
    console.log(err)
})