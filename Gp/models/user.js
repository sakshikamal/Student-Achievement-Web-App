const mongoose= require("mongoose")

const userSchema=new mongoose.Schema({
    userid:{
        type:String,
        required:[true,"Userid cannot be blank"]
    },
    username:{
        type:String,
        required: [true,"Username cannot be blank"]
    },
    password:{
        type:String,
        required: [true,"Password cannot be blank"]
    }
})

module.exports=mongoose.model('User',userSchema);