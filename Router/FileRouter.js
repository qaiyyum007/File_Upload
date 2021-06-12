
import  express from 'express'
const expressRouter=express.Router()
import {isAuth} from '../middleware/auth.js'

import multer from 'multer';
import path from 'path';
import File from '../Model/FileModel.js';
import { v4 as uuidv4 } from 'uuid';
import User from '../Model/UserModel.js';

let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/') ,
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
              cb(null, uniqueName)
    } ,
});

let upload = multer({ storage, limits:{ fileSize: 1000000 * 100 }, }).single('myfile');//100mb



class FileRouter{
    fileRouter
    constructor(){
     this.fileRouter=expressRouter
     this.fileRouter.post('/upload' ,isAuth,async(req,res)=>{
         try{

            let user = await User.findById(req.user._id);
            if (!user) return res.status(404).json("User not found");
            upload(req, res, async (err) => {
                if (err) {
                  return res.status(500) .send({ error: err.message });
                }
             
                  const file = new File({
                      filename: req.file.filename,
                      uuid: uuidv4(),
                      path: req.file.path,
                      size: req.file.size,
                      user: req.user._id,
                  });
                  const response = await file.save();
                   res.json({ response });
                });      

         }
        
            
         catch (err) {
            return res.status(500).send(`${err.message}-${err.stack}`)
        }
      
       
     })


     this.fileRouter.delete('/delete/:id' ,async(req,res)=>{

        try {
            const file = await File.findByIdAndDelete(req.params.id);
         
            return res.send('file has been deleted')

        } catch (err) {
            return res.status(500).send(`${err.message}-${err.stack}`)
        }
     })


     this.fileRouter.get('/all-file' ,isAuth ,async(req,res)=>{

        try {
            const files = await File.find();



            let userflies = files.filter(
                (file) => file.name === req.name_id
              );
         
            return res.send(userflies)

        } catch (err) {
            return res.status(500).send(`${err.message}-${err.stack}`)
        }
     })




    
           

    }
}

export default  FileRouter