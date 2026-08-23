require('dotenv').config(); // Nạp cấu hình PORT và MONGODB_URI từ file .env
const express = require('express');
const cors = require('cors');

const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
app.use(cors());
// Cấu hình để Express xử lý dữ liệu dạng JSON từ client gửi lên
app.use(express.json());

// Câu 33: Tiến hành kết nối Express Backend với MongoDB Atlas thông qua Mongoose
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("=========================================");
        console.log("Kết nối MongoDB Atlas thành công!");
        console.log("=========================================");
    })
    .catch(err => {
        console.error("Lỗi kết nối cơ sở dữ liệu MongoDB Atlas:");
        console.error(err);
    });
    const studentSchema = new mongoose.Schema({
    studentId: String,
    name: String,
    email: String
    });

const Student = mongoose.model('Student', studentSchema);

// API kiểm tra (Đã tạo ở Câu 22)
app.get('/api/hello', (req, res) => {
    res.json({ 
        status: "success", 
        message: "Xác nhận: Backend đang hoạt động ổn định!" 
    });
});

// Câu 36: API lấy danh sách sinh viên
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi lấy danh sách sinh viên",
            error: error.message
        });
    }
});
// Câu 37: API thêm sinh viên
app.post('/api/students', async (req, res) => {
    try {
        const student = await Student.create(req.body);

        res.status(201).json({
            message: "Thêm sinh viên thành công",
            student: student
        });
    } catch (error) {
        res.status(400).json({
            message: "Lỗi khi thêm sinh viên",
            error: error.message
        });
    }
});
// Câu 38: API cập nhật sinh viên
app.put('/api/students/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!student) {
            return res.status(404).json({
                message: "Không tìm thấy sinh viên"
            });
        }
        res.json({
            message: "Cập nhật sinh viên thành công",
            student: student
        });
    } catch (error) {
        res.status(400).json({
            message: "Lỗi khi cập nhật sinh viên",
            error: error.message
        });
    }
});
// Câu 39: API xóa sinh viên
app.delete('/api/students/:id', async (req, res) => {
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
        res.status(400).json({
            message: "Lỗi khi xóa sinh viên",
            error: error.message
        });
    }
});
// Khởi chạy Express Server trên Port 5000
app.listen(PORT, () => {
    console.log(`Express Server đang chạy trên port ${PORT}`);
});