const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Chuỗi kết nối chỉ định trực tiếp database /test
const mongoURI = process.env.MONGO_URI || "mongodb+srv://cloud-lab:m7%4069yJFvQ_r7iG@nghi.crfcxmf.mongodb.net/test?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
  .then(() => console.log(">>> Connected successfully to MongoDB Atlas (Database: test)"))
  .catch(err => console.error(">>> MongoDB Connection Error:", err));

const StudentSchema = new mongoose.Schema({
  maSV: String,
  hoTen: String,
  email: String
});

const Student = mongoose.model('Student', StudentSchema);

app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const { maSV, hoTen, email } = req.body;
    const newStudent = new Student({ maSV, hoTen, email });
    await newStudent.save();
    console.log("Thêm sinh viên thành công vào DB test:", newStudent);
    res.status(201).json(newStudent);
  } catch (err) {
    console.error("Lỗi POST /api/students:", err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
