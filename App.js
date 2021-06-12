import express from 'express'

import dotenv from 'dotenv'
import ConnectDB from './Database.js'
import AuthRouter from './Router/AuthRouter.js'
import FileRouter from './Router/FileRouter.js'

dotenv.config()
const app=express()


app.use(express.json({ extended: false }));


// funcation connect to app to database
ConnectDB()
const PORT=process.env.PORT||7744

app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
})

app.use('/api', new AuthRouter().authRouter)
app.use('/api', new FileRouter().fileRouter)