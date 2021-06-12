import  express from 'express'
const expressRouter=express.Router()
import   bcrypt from 'bcrypt'
import {isAuth} from '../middleware/auth.js'
import   jwt  from'jsonwebtoken'
import User from '../Model/UserModel.js';




class AuthRouter{
    authRouter
    constructor(){
     this.authRouter=expressRouter
     this.authRouter.post('/registration' ,async(req,res)=>{
        try {
            const {name,email,password}=req.body

             const exitsUser= await User.findOne({email})
             if(exitsUser){
                 return res.send("email alreday exits")
             }
             const hasedPassword= await bcrypt.hash(password,12)

             const newUser = new User({
                name, email, password: hasedPassword
            })


         const user=   await newUser.save()
  
            res.json(user)        
            
        } catch (err) {
            return res.status(500).send(`${err.message}-${err.stack}`)
        }
      
       
     })


    



     this.authRouter.post('/login' ,async(req,res)=>{

        try {
            
            const {email,password}=req.body

             const user= await User.findOne({email})
             if(!user){
                 return res.status(404).send("email does not exits")
             }
             const isMatch = await bcrypt.compare(password, user.password)
             if(!isMatch) return res.status(400).json({msg: "Incorrect password."})

             const token=jwt.sign({ _id:user._id, email:req.body.email },process.env.ACCESS_TOKEN_SECRET,{expiresIn:"1h"})

             return res.status(200).send({
                 token
               
             })


        } catch (err) {
            return res.status(500).send(`${err.message}-${err.stack}`)
        }
     })

// get Single User
    

this.authRouter.get('/profile/:id',isAuth ,async(req,res)=>{

    try {
        const user = await User.findById(req.user._id)
        if (user) {
            res.send({
              _id: user._id,
              name: user.name,
              email: user.email,
            })
        }else {
            return res.status(404).send(" user is not found")
        }

        return res.status(200).send(user)

    } catch (err) {
        return res.status(500).send(`${err.message}-${err.stack}`)
    }
 })


   


    }
}

export default  AuthRouter