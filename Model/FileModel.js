import mongoose from 'mongoose'

let fileSchema = new  mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      name: {
        type: String,
      },
    filename: { 
        type: String, 
        required: true 
    
    },

    path: { type: String, 
        required: true 
    },

    size: { type: Number,
         required: true
         },

    uuid: { type: String, 
        required: true 
    },
  
},{
    timestamps:true,
});

const User=mongoose.model('File', fileSchema);



export default User
