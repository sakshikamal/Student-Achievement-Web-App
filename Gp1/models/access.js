const mongoose= require("mongoose")

const accessSchema=new mongoose.Schema({
    rid:{
        type:String,
        required:[true,"rid cannot be blank"]
    },
    usn:{
        type:[],
        required: [true,"Usn cannot be blank"]
    },
})

module.exports=mongoose.model('Access',accessSchema);