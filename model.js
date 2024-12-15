const mongoose=require("mongoose");

const TodoList=new mongoose.Schema({
    task:{
        type:String,
        require:true,
    },
    date:{
        type:String,
        require:true,
    },
    complete:{
        type:Boolean,
        default:false,
    }
})
module.exports=mongoose.model("TodoList",TodoList);