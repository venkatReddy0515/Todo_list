const express = require("express");
const mongoose = require("mongoose");
const TodoList = require("./model");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();
app.use(cors({origin: 'https://todolistmern-23vt.onrender.com/'}));
app.use(express.json());
dotenv.config();

const port = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('Database connected!'))
.catch(err => console.error('Database connection error:', err));


app.get("/", async (req, res) => {
    try {
        const data = await TodoList.find();
        if (data) {
            return res.status(200).json(data);
        }
    } catch (error) {
        return res.status(404).json(error);
    }
});

app.post("/task", async (req, res) => {
    const { task, date } = req.body;
    if (!task || !date) {
        return res.status(400).json({ message: "Required fields are missing" });
    }
    try {
        const newTask = new TodoList({ task, date });
        await newTask.save();
        return res.status(200).json("Successfully added");
    } catch (error) {
        return res.status(404).json(error.message);
    }
});

app.put("/task/:id", async (req, res) => {
    const { task, complete } = req.body;
    try {
        let updatedTask;
            updatedTask = await TodoList.findByIdAndUpdate(
                req.params.id,
                { task,complete },
                { new: true }
            );
        

        if (updatedTask) {
            return res.status(200).json("Successfully updated.");
        } else {
            return res.status(404).json("Task not found.");
        }
    }
    catch (error) {
        return res.status(500).json({ message: "Error updating task.", error: error.message });
    }
})

app.delete("/task/:id", async (req, res) => {
    try {
        const deleteTask = await TodoList.findByIdAndDelete(req.params.id);
        if (deleteTask) {
            return res.status(200).json("Successfully deleted");
        } else {
            return res.status(404).json("Task not found");
        }
    } catch (error) {
        return res.status(500).json({ message: "Error deleting task.", error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
