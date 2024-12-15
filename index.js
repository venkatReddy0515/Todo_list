const express = require("express");
const mongoose = require("mongoose");
const TodoList=require("./model")
const dotenv = require("dotenv");
const cors = require("cors");
const app=express();
app.use(cors());
app.use(express.json());
dotenv.config();

const port=process.env.PORT||4000;

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("Connection is Done.")
})
.catch((err)=>{
    console.log("Connection failed::",err);
})

app.get("/",async(req,res)=>{
    try{
    const data=await TodoList.find();
    if(data){
        return res.status(200).json(data);
    }

    }
    catch(error){
        return res.status(404).json(error);
    }
})

app.post("/task",async (req,res)=>{
    const {task,date}=req.body;
    if(!task || !date){
        return res.status(400).json("Filled required.")
    }
    try{
    const newTask=new TodoList({task,date});
    await newTask.save();
    return res.status(200).json("Successfully addedd");
    }
    catch(error){
        return res.status(404).json(error.message);
    }
})

app.put("/task/:id", async (req, res) => {
    const { task,complete} = req.body; // Accept all fields that might be updated
    try {
     if(complete===false){
        const updatedTask = await TodoList.findByIdAndUpdate(
            req.params.id,
            { task},
            { new: true }
        );
     }
     else{
        updatedTask = await TodoList.findByIdAndUpdate(
            req.params.id,
            { complete},
            { new: true }
        );
     }
    
        if(updatedTask){
            return res.status(200).json("Successfully updated.");
        }
    

        
    } catch (error) {
      // Catch and handle errors
      return res.status(500).json({ message: "Error updating task.", error: error.message });
    }

  });
  
app.listen(port,()=>{
    console.log(`server is running on http://localhost:${port}`);
})

app.delete("/task/:id",async(req,res)=>{
    const deleteTask=await TodoList.findByIdAndDelete(req.params.id);
    if(deleteTask){
        return res.status(200).json("Succesfully deleted");
    }
    else{
        return res.status(400).json("Error while deleting");
    }
})