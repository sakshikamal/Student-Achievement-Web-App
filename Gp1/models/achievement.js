const mongoose= require("mongoose")

const achSchema=new mongoose.Schema({
    userid:{
        type:String,
        required:[true,"Userid cannot be blank"]
    },
    achtype:{
        type:String,
        required: [true,"Achievement type cannot be blank"]
    },
    link:{
        type:String,
        required: [true,"Drive Link cannot be blank"]
    },
    desc:{
        type:String,
        required:[true,"Short Description is mandatory"]
    }
})

module.exports=mongoose.model('Achievement',achSchema);