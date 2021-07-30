const mongoose= require("mongoose")

const collectSchema=new mongoose.Schema({
    tid:{
        type:String,
        required:[true,"tid cannot be blank"]
    },
    usn:{
        type:[],
        required: [true,"Usn cannot be blank"]
    },
})

module.exports=mongoose.model('Collect',collectSchema);