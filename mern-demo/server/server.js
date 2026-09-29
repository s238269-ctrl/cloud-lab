require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Student = require("./Model/Student");

const app = express();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());

app.use(express.json());

// API lấy danh sách sinh viên
app.get("/api/students", async (req, res) => {
    try {
        const students = await Student.find();

        res.json(students);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi lấy danh sách sinh viên",
            error: error.message
        });
    }
});

// Xây dựng API POST /api/students để thêm sinh viên
app.post("/api/students", async (req, res) => {
    try {
        const student = await Student.create(req.body);

        res.status(201).json(student);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi thêm sinh viên",
            error: error.message
        });
    }
});
// Xây dựng API PUT /api/students/:id để cập nhật sinh viên
app.put("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({
                message: "Không tìm thấy sinh viên"
            });
        }

        res.json(student);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi cập nhật sinh viên",
            error: error.message
        });
    }
});
// Xây dựng API DELETE /api/students/:id để xóa sinh viên
app.delete("/api/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Không tìm thấy sinh viên"
            });
        }

        res.json({
            message: "Xóa sinh viên thành công",
            student: student
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi xóa sinh viên",
            error: error.message
        });
    }
});

// Câu 36: Tiến hành kết nối Express Backend với MongoDB Atlas thông qua Mongoose
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("=========================================");
        console.log("Kết nối MongoDB Atlas thành công!");
        console.log("Database:", mongoose.connection.name);
        console.log("Collection:", Student.collection.name);;
        console.log("=========================================");

        app.listen(PORT, () => {
            console.log(`Express Server đang chạy trên port ${PORT}`);
        });
    })
    .catch(err => {
        console.error("Lỗi kết nối cơ sở dữ liệu MongoDB Atlas:");
console.error(err);
    });


// API kiểm tra (Đã tạo ở Câu 22)
app.get('/api/hello', (req, res) => {
    res.json({
        status: "success",
        message: "Xác nhận: Backend đang hoạt động ổn định!"
    });
});