const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://komalpreetkaur11466:komal11466@cluster0.ljbxjzk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));

// Schema and Model
const stuschema = new mongoose.Schema({
  name: String,
  age: Number,
  course: String,
});

const Student = mongoose.model('intern', stuschema);

// GET all students
app.get('/data', async (req, res) => {
  try {
    const students = await Student.find({});
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new student
app.post('/data', async (req, res) => {
  try {
    const { name, age, course } = req.body;
    const newStudent = new Student({ name, age, course });
    await newStudent.save();
    res.status(201).json({ message: 'Student added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE student by ID
app.delete('/data/:id', async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//update
app.put('/data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Received update request for id:", id);
    const { name, age, course } = req.body;
    console.log("Update data:", { name, age, course });

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { name, age, course },
      { new: true }
    );

    if (!updatedStudent) {
      console.log("Student not found for id:", id);
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(updatedStudent);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: err.message });
  }
});


// Start server
const port = 3002;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
